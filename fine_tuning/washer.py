import json

def process_text_to_json(input_file_path, output_file_path):
    # Read all lines from the input file
    with open(input_file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    # Remove any newline characters and extra spaces from each line
    lines = [line.strip() for line in lines if line.strip()]

    # Prepare the data for JSON format
    data = []
    for i in range(0, len(lines) - 1, 2):  # Step by 2 to pair lines as input and output
        entry = {
            "instruction": "What would you say in the scenario given?",
            "input": lines[i],
            "output": lines[i + 1]
        }
        data.append(entry)

    # Write the data to a JSON file
    with open(output_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

# Example usage
input_path = '../data/furina.txt'  # Adjust the path to your actual text file
output_path = '../data/furina.json'  # Path where you want to save the JSON file
process_text_to_json(input_path, output_path)
