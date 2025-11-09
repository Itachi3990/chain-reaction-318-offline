import sys

def calculate_percentages(filename):
    try:
        with open(filename, 'r') as file:
            lines = file.readlines()

        # Filter out empty lines and strip whitespace
        entries = [line.strip() for line in lines if line.strip()]

        if not entries:
            print("The file contains no valid entries.")
            return

        total = len(entries)
        r_count = entries.count('R')
        b_count = entries.count('B')

        r_percentage = (r_count / total) * 100
        b_percentage = (b_count / total) * 100

        print(f"Total entries: {total}")
        print(f"R: {r_percentage:.2f}%")
        print(f"B: {b_percentage:.2f}%")

    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python count.py <filename>")
    else:
        calculate_percentages(sys.argv[1])
