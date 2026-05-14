/**
 * ImageVerification.js
 * Verification logic for ConservationCred image uploads.
 * Runs silently in the background as a utility function.
 */

// Haversine formula for GPS distance calculation in meters
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRad = (val) => val * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

/**
 * Validates a before and after image pair against report data and historical database context.
 * 
 * @param {Object} beforeImg - Before image metadata (userId, reportId, gps: {lat, lon}, timestamp, device, hash)
 * @param {Object} afterImg - After image metadata
 * @param {Object} reportData - Report metadata (userId, gps: {lat, lon}, submissionTime)
 * @param {Object} dbContext - Database context arrays/objects (hashes, flaggedInternetHashes, deviceUsers, users)
 * @returns {Promise<{ trustScore: number, outcome: string, reasons: string[] }>}
 */
export const verifyImages = async (beforeImg, afterImg, reportData, dbContext) => {
    const reasons = [];
    let rejectImmediately = false;
    let trustScore = 100;

    // 1. EXIF Metadata Presence
    const checkExif = (img, label) => {
        if (!img.gps || !img.gps.lat || !img.gps.lon) {
            reasons.push(`${label} image is missing GPS EXIF metadata.`);
            trustScore -= 15;
        }
        if (!img.timestamp) {
            reasons.push(`${label} image is missing EXIF timestamp.`);
            trustScore -= 15;
        }
        if (!img.device) {
            reasons.push(`${label} image is missing device fingerprint.`);
            trustScore -= 10;
        }
    };
    
    checkExif(beforeImg, 'Before');
    checkExif(afterImg, 'After');

    // 2. Perceptual Hash Duplicate Detection
    if (dbContext?.hashes?.includes(beforeImg.hash)) {
        reasons.push("Before image matches a previously uploaded image in the database (duplicate).");
        trustScore -= 40;
    }
    if (dbContext?.hashes?.includes(afterImg.hash)) {
        reasons.push("After image matches a previously uploaded image in the database (duplicate).");
        trustScore -= 40;
    }

    // 3. Cross-verify GPS within 200m radius
    if (beforeImg.gps && reportData.gps) {
        const dist = getDistance(beforeImg.gps.lat, beforeImg.gps.lon, reportData.gps.lat, reportData.gps.lon);
        if (dist > 200) {
            reasons.push(`Before image GPS is ${Math.round(dist)}m from the reported location (exceeds 200m radius).`);
            trustScore -= 25;
        }
    }
    if (afterImg.gps && reportData.gps) {
        const dist = getDistance(afterImg.gps.lat, afterImg.gps.lon, reportData.gps.lat, reportData.gps.lon);
        if (dist > 200) {
            reasons.push(`After image GPS is ${Math.round(dist)}m from the reported location (exceeds 200m radius).`);
            trustScore -= 25;
        }
    }

    // 4. Cross-verify EXIF timestamp with report submission time
    const subTime = new Date(reportData.submissionTime).getTime();
    [beforeImg, afterImg].forEach((img, idx) => {
        const label = idx === 0 ? 'Before' : 'After';
        if (img.timestamp) {
            const imgTime = new Date(img.timestamp).getTime();
            const diff = subTime - imgTime;
            
            if (diff < 0) {
                reasons.push(`${label} image timestamp is in the future relative to the submission time.`);
                trustScore -= 30;
            } else if (diff > 7 * 24 * 3600 * 1000) { // 7 days
                reasons.push(`${label} image is older than 7 days from submission time.`);
                trustScore -= 15;
            }
        }
    });

    // 5. Verify Before/After User ID and Report ID consistency
    if (beforeImg.userId !== afterImg.userId) {
        reasons.push("CRITICAL: User ID mismatch between Before and After images.");
        rejectImmediately = true;
    }
    if (beforeImg.reportId !== afterImg.reportId) {
        reasons.push("CRITICAL: Report ID mismatch between Before and After images.");
        rejectImmediately = true;
    }

    // 6. Logical Time Ordering and Gap Check
    if (beforeImg.timestamp && afterImg.timestamp) {
        const bTime = new Date(beforeImg.timestamp).getTime();
        const aTime = new Date(afterImg.timestamp).getTime();
        
        if (bTime > aTime) {
            reasons.push("Logical Error: Before image was taken chronologically after the After image.");
            trustScore -= 40;
        } else if (aTime - bTime < 60 * 1000) { // less than 1 minute gap
            reasons.push("Suspiciously fast turnaround: Less than 1 minute gap between Before and After images.");
            trustScore -= 20;
        }
    }

    // 7. Reverse Image Search Check (Simulated API Call)
    if (dbContext?.flaggedInternetHashes?.includes(beforeImg.hash)) {
        reasons.push("Before image found on the internet via reverse image search.");
        rejectImmediately = true;
    }
    if (dbContext?.flaggedInternetHashes?.includes(afterImg.hash)) {
        reasons.push("After image found on the internet via reverse image search.");
        rejectImmediately = true;
    }

    // 8. Device Fingerprint Checking
    if (beforeImg.device && dbContext?.deviceUsers) {
        const usersWithDevice = dbContext.deviceUsers[beforeImg.device] || [];
        if (usersWithDevice.length > 1 && !usersWithDevice.includes(reportData.userId)) {
            reasons.push(`Device fingerprint (${beforeImg.device}) is shared among multiple different accounts.`);
            trustScore -= 20;
        }
    }

    // 9. User ID History Check
    if (dbContext?.users) {
        const userHist = dbContext.users[reportData.userId] || { lowTrustCount: 0 };
        if (userHist.lowTrustCount >= 2) {
            reasons.push("User has a history of repeated low-trust submissions.");
            trustScore -= 25;
        }
    }

    // Calculate final outcome
    let outcome = "approved";
    trustScore = Math.max(0, trustScore);

    if (rejectImmediately || trustScore <= 30) {
        outcome = "rejected";
    } else if (reasons.length > 0 || trustScore < 80) {
        outcome = "flagged for review";
    }

    return {
        trustScore,
        outcome,
        reasons
    };
};

export default verifyImages;