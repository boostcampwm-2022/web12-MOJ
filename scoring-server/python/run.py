import sys

def run(code):
    print(code)

if __name__ == '__main__':
    if (len(sys.argv) > 1):
        run(sys.argv[1])