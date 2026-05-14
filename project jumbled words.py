'''import random
import mysql.connector
conn=mysql.connector.connect(host='localhost',user='root', password='root',database='db')
cur=conn.cursor()
print("HELLO USER!!")
print("WELCOME TO THE WORLD OF JUMBLE WORD")
print("LET US START OUR GAME")
print("YOUR JUMBLED WORD ARE HERE")
print(" ")
point=0
while True:
    qno=random.randint(1,4)
    sql='select*from jumbleword where WNO='+str(qno)
    print(cur.execute(sql))
    for i in x:
        word=i[1]
    orig=word
    print(orig)
    word=list(word)
    random.shuffle(word)
    wordj=''.join(word)
    print(wordj)
    ans=input('Enter your word:')
    if ans==orig:
        point=point+100
        print('Your answer is correct')
        continue
    else:
        print('The word start with',orig[0])
        ans=input('Enter your word:')
        if ans==orig:
            point=point+50
            print('Your answer is correct')
        else:
            print('The word end with',orig[-1])
            ans=input('Enter your word:')
            if ans==orig:
                point=point+25
                print('Your answer is correct')
            else:
                print('GAME OVER')
                print('Your Score is ',point)
                print('I hope you have enjoyed this game, come back soon')
                break


'''

import random
import mysql.connector
conn=mysql.connector.connect(host='localhost',user='root', password='root',database='db')
cur=conn.cursor()

while True:
    qno=random.randrange(1,4)
    print(qno)
    '''sql='select*from jumbleword where WNO='+str(qno)
    print(cur.execute(sql))
    for i in x:
        word=i[1]
    orig=word'''







    

