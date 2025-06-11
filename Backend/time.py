import sys

def calculate_average_difference(filename):
    try:
        with open(filename, 'r') as file:
            # Read all non-empty lines and convert them to floats
            times = [float(line.strip()) for line in file if line.strip()]

        if len(times) < 2:
            print("The file must contain at least two timestamps.")
            return

        differences = [t2 - t1 for t1, t2 in zip(times, times[1:])]
        average_diff = sum(differences) / len(differences)

        minutes = int(average_diff // 60)
        seconds = average_diff % 60

        print(f"Average difference: {minutes} minutes {seconds:.2f} seconds")

    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
    except ValueError:
        print("Error: The file must contain only valid numbers.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python average_diff.py <filename>")
    else:
        calculate_average_difference(sys.argv[1])
