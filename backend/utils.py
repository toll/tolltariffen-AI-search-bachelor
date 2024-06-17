import json

from configuration import config as cfg
from helpers.data_preparation import clean_html_entities


def extract_pairs(item, path=[]):
    """
    Recursively extract prompt-completion pairs from a JSON structure.
    """
    pairs = []
    if isinstance(item, dict):
        prompt = " > ".join(path + [item.get("beskrivelse", "")]).strip(" > ")
        completion = item.get("id", "") + " " + item.get("vareslag", "").strip()
        if prompt and completion:
            pairs.append({"prompt": prompt, "completion": completion})
        for key, value in item.items():
            new_path = (
                path + [item.get("beskrivelse", "")]
                if key not in ["id", "vareslag"]
                else path
            )
            pairs.extend(extract_pairs(value, new_path))
    elif isinstance(item, list):
        for sub_item in item:
            pairs.extend(extract_pairs(sub_item, path))
    return pairs


def fully_flatten_json(file_path):
    """
    Load, clean HTML entities, and flatten a JSON file into JSONL format.
    """
    # Load and clean the JSON data
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    cleaned_data = clean_html_entities(data)

    # Extract pairs from the cleaned data
    extracted_pairs = extract_pairs(cleaned_data)

    # Write the extracted pairs to the output file in JSONL format
    output_path = cfg.CONFIG_VALUES["dataset_json_flattened_path"]
    with open(output_path, "w", encoding="utf-8") as output_file:
        for pair in extracted_pairs:
            output_file.write(json.dumps(pair) + "\n")


def extract_hsnumber_chat_pairs(item, path=[]):
    """
    Generates chat interactions focusing on items with complete information
    ('type', 'id', 'hsNummer', 'vareslag', 'blv'), formatted correctly for chat.
    """
    chats = []
    if isinstance(item, dict):
        # Initialize variables for the current item
        description = clean_html_entities(item.get("beskrivelse", "")).strip(".")

        # Always define current_path, using description if it's not empty
        current_path = path + [description] if description else path

        hsNumber = item.get("hsNummer", None)
        vareslag = clean_html_entities(item.get("vareslag", "")).strip()

        # Generate chat interaction if the item is of type 'vare' and has an HS number
        if item.get("type") == "vare" and hsNumber:
            # Ensure there's a meaningful path to describe in the user content
            if current_path:
                user_content = (
                    f"Tell me the hs number for '{' > '.join(current_path)}'."
                )
                assistant_content = f"The HS number for '{' > '.join(current_path)}' is {hsNumber}. Detail: {vareslag}"

                chat_interaction = {
                    "messages": [
                        {
                            "role": "system",
                            "content": "You're speaking with a bot knowledgeable about commodity codes.",
                        },
                        {"role": "user", "content": user_content},
                        {"role": "assistant", "content": assistant_content},
                    ]
                }
                chats.append(chat_interaction)

        # Recursively traverse the structure, ensuring to pass the current path
        for key, value in item.items():
            if isinstance(value, (dict, list)) and key not in [
                "beskrivelse",
                "hsNummer",
                "vareslag",
                "type",
            ]:
                chats.extend(extract_hsnumber_chat_pairs(value, current_path))

    elif isinstance(item, list):
        # Process each item in the list without modifying the path
        for sub_item in item:
            chats.extend(extract_hsnumber_chat_pairs(sub_item, path))

    return chats


def fully_flatten_json_to_hsnumber_chat_format(file_path):
    """
    Transform a JSON file into a chatbot interaction format focusing on detailed paths and HS numbers.
    """
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    cleaned_data = clean_html_entities(data)

    extracted_chats = extract_hsnumber_chat_pairs(cleaned_data)

    with open(
        cfg.CONFIG_VALUES["dataset_json_flattened_chat_path"], "w", encoding="utf-8"
    ) as output_file:
        for chat in extracted_chats:
            output_file.write(json.dumps(chat) + "\n")
