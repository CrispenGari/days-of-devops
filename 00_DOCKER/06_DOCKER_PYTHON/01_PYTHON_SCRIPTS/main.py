import random
from prettytable import PrettyTable


while True:
    number = int(input("Guess a number between 1 and 5: "))
    table = PrettyTable()
    table.field_names = ["Guessed", "Correct", "Win", "Difference"]
    correct = random.randint(1, 5)
    table.add_rows([[number, correct, correct==number, correct-number]])
    print(table)
    
    yesOrNo = input("Do you want to keep on playing (y/N): ").strip().lower()

    if yesOrNo[0] == 'n':
        break
    else:
        continue