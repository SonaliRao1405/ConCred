import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from 'leaflet';
import { useTranslation } from 'react-i18next';
import "leaflet/dist/leaflet.css";

const reports = [
    {
        id: 1,
        lat: 13.0827,
        lng: 80.2707,
        activityKey: "activityTurtle",
    },
    {
        id: 2,
        lat: 12.9716,
        lng: 77.5946,
        activityKey: "activitySnare",
    },
];

// Custom Soft-Glow Marker Icon
const createGlowIcon = () => {
    return divIcon({
        className: 'custom-icon',
        html: '<div class="glow-marker"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
};

export default function Heatmap() {
    const { t } = useTranslation();
    const glowIcon = createGlowIcon();

    return (
        <MapContainer
            center={[13.0827, 80.2707]}
            zoom={6}
            style={{ height: "500px", width: "100%", borderRadius: "16px", zIndex: 1 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {reports.map((report) => (
                <Marker
                    key={report.id}
                    position={[report.lat, report.lng]}
                    icon={glowIcon}
                >
                    <Popup>
                        <div style={{ padding: '4px' }}>
                            {t(report.activityKey)}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}