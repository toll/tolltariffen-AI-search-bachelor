import html
import json

import openai

from ._types import Article


def clean_html_entities(data):
    """
    Recursively clean HTML entities in all string values of the JSON structure.
    """
    if isinstance(data, dict):
        return {k: clean_html_entities(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [clean_html_entities(item) for item in data]
    elif isinstance(data, str):
        return html.unescape(data)
    else:
        return data


def extract_chatbot_interactions(data: dict) -> list[Article]:
    sections = data["avsnitt"]
    known_list_properties = ["kapitler", "inndelinger", "oppdelinger", "posisjoner"]
    known_type_values = [
        "avsnitt",
        "kapittel",
        "posisjon",
        "vare",
        "underposisjon",
        "underkapittel",
    ]

    def process_entity(entity, descriptions) -> list[Article]:
        entity_type = entity.get("type")
        assert entity_type in known_type_values, f"Unknown type: {entity_type}"
        # Update descriptions based on type
        if entity_type in known_type_values and "beskrivelse" in entity:
            if entity_type in descriptions:
                _desc = descriptions[entity_type]
                descriptions[entity_type] = f'{_desc}; {entity["beskrivelse"]}'
            else:
                descriptions[entity_type] = entity["beskrivelse"]
            if entity_type == "underposisjon":
                if "underposisjon_hsNummer" in descriptions:
                    _desc = descriptions["underposisjon_hsNummer"]
                    descriptions["underposisjon_hsNummer"] = (
                        f'{_desc}; {entity["hsNummer"]}'
                    )
                else:
                    descriptions["underposisjon_hsNummer"] = entity["hsNummer"]
        # If the entity is a 'vare', process and return the collected descriptions
        if entity_type == "vare":
            # Combine all descriptions into a final description for this vare
            final_description = {k: v for k, v in descriptions.items() if v or v == ""}
            final_description["vare_description"] = entity.get("vareslag", "")
            final_description["vare_hsNummer"] = entity.get("hsNummer", "")
            return [final_description]
        # Recursive case: process child entities
        results: list[Article] = []
        for prop in known_list_properties:
            if prop in entity:
                for child in entity[prop]:
                    results.extend(process_entity(child, dict(descriptions)))
        return results

    # Initial call to the recursive function for each section
    all_vare_descriptions: list[Article] = []
    for section in sections:
        all_vare_descriptions.extend(process_entity(section, {}))
    return all_vare_descriptions


def main_prepare_json(file_path):
    """
    | Transform JSON file to flattened version for chatbot interaction
    """
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    cleaned_data = clean_html_entities(data)
    all_articles = extract_chatbot_interactions(data=cleaned_data)
    # todo:: create mapper [skip]


def upload_training_file(client: openai.OpenAI, file_path: str):
    response = client.files.create(
        file=open(
            file_path,
            "rb",
        ),
        purpose="fine-tune",
    )
    print(
        f"File ID: {response.id} for file {response.filename}. Status: {response.status}"
    )
    return response.id
