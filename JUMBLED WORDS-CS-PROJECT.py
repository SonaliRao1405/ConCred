
import random
import mysql.connector
conn=mysql.connector.connect(host='localhost',user='root', password='root',database='db')
cur=conn.cursor()
print("HELLO USER!!")
print("WELCOME TO THE WORLD OF JUMBLE WORD")
print("LET US START THE GAME")
print("YOUR JUMBLED WORD IS HERE")
print(" ")

point=0
while True:
    qno=random.randint(1,51)
    sql='select*from jumbleword where WNO='+str(qno)
    cur.execute(sql)
    for i in cur:
        word=i[1]
    orig=word
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
                print('The word is:',orig)
                print('Your Score is ',point)
                print('I hope you enjoyed this game, come back soon')
                break
  







    
