<<<<<<< HEAD
# convert_pickle.py
# This script converts a pickle file to JSON format for use in JavaScript
import pickle
import json
import os

def convert_pickle_to_json(pickle_file, json_file):
    """
    Convert a pickle file to JSON format.
    
    Args:
        pickle_file: Path to the pickle file
        json_file: Path to save the JSON file
    """
    print(f"Converting {pickle_file} to {json_file}...")
    
    # Check if input file exists
    if not os.path.exists(pickle_file):
        print(f"Error: Input file {pickle_file} does not exist.")
        return False
    
    try:
        # Load pickle file
        with open(pickle_file, 'rb') as f:
            data = pickle.load(f)
        
        # Convert data to JSON
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Conversion successful! JSON file saved to {json_file}")
        print(f"Converted {len(data)} items.")
        
        # Show sample of data
        if isinstance(data, list) and len(data) > 0:
            print(f"Sample item: {data[0][:100]}..." if isinstance(data[0], str) else data[0])
        
        return True
    
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        return False

if __name__ == "__main__":
    # File paths
    input_file = "./data/context_texts.pkl"
    output_file = "./data/context_texts.json"
    
    # Convert pickle to JSON
    success = convert_pickle_to_json(input_file, output_file)
    
    if success:
        print("✅ Conversion completed successfully")
    else:
=======
# convert_pickle.py
# This script converts a pickle file to JSON format for use in JavaScript
import pickle
import json
import os

def convert_pickle_to_json(pickle_file, json_file):
    """
    Convert a pickle file to JSON format.
    
    Args:
        pickle_file: Path to the pickle file
        json_file: Path to save the JSON file
    """
    print(f"Converting {pickle_file} to {json_file}...")
    
    # Check if input file exists
    if not os.path.exists(pickle_file):
        print(f"Error: Input file {pickle_file} does not exist.")
        return False
    
    try:
        # Load pickle file
        with open(pickle_file, 'rb') as f:
            data = pickle.load(f)
        
        # Convert data to JSON
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Conversion successful! JSON file saved to {json_file}")
        print(f"Converted {len(data)} items.")
        
        # Show sample of data
        if isinstance(data, list) and len(data) > 0:
            print(f"Sample item: {data[0][:100]}..." if isinstance(data[0], str) else data[0])
        
        return True
    
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        return False

if __name__ == "__main__":
    # File paths
    input_file = "./data/context_texts.pkl"
    output_file = "./data/context_texts.json"
    
    # Convert pickle to JSON
    success = convert_pickle_to_json(input_file, output_file)
    
    if success:
        print("✅ Conversion completed successfully")
    else:
>>>>>>> bae8c230bc388cad2c369e1764d9724f7fce87d7
        print("❌ Conversion failed")