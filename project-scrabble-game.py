import mysql.connector
import random

class ScrabbleGame:
    def _init_( host, user, password, database):
        self.connection = mysql.connector.connect(host=host, user=user,password=password,database=database )
        self.cursor = self.connection.cursor()
        self.word_list = self.load_word_list()

    def load_word_list(self):
        query = "SELECT word FROM scrabble_words"
        self.cursor.execute(query)
        return [word[0] for word in self.cursor.fetchall()]

    def get_random_word(self):
        return random.choice(self.word_list)

    def check_word(self, user_word):
        return user_word.lower() in self.word_list

    def play_game(self):
        print("Welcome to the Scrabble Game!")
        score = 0

        while True:
            user_input = input("\nEnter a word (or 'exit' to end the game): ")

            if user_input.lower() == 'exit':
                break

            if self.check_word(user_input):
                word_score = len(user_input)  # Score based on the length of the word
                score += word_score
                print(f"Valid word! Your score: {score}")
            else:
                print("Invalid word. Try again.")

        print(f"\nGame Over! Your final score: {score}")

    def close_connection(self):
        self.cursor.close()
        self.connection.close()
        print("Database connection closed.")

def main():
    db = ScrabbleGame(localhost,root, root,db)
    db.play_game()
    db.close_connection()
    print("Exiting the program. Goodbye!")

#-main-
main()
