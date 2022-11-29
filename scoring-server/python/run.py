import sys
import time
import random

def run(code):
    for _ in range(5):
        time.sleep(1)
    return random.randrange(1,7)


if __name__ == '__main__':
    if (len(sys.argv) > 1):
        print(run(sys.argv[1]))