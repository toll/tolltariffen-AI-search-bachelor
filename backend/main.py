import json
import os.path

import numpy as np
import openai
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

import configuration.config as cfg
import helpers.data_preparation as dp

cfg.check_config()
CLIENT = openai.OpenAI(api_key=cfg.CONFIG_VALUES["open_ai_token"])


def get_embedding(text_input: pd.Series | str, model="text-embedding-3-small"):
    values_as_string = (
        text_input if isinstance(text_input, str) else text_input.str.cat(sep=" ")
    )
    return (
        CLIENT.embeddings.create(input=[values_as_string], model=model)
        .data[0]
        .embedding
    )


def get_embedded_data() -> pd.DataFrame:
    if os.path.exists((_path := cfg.CONFIG_VALUES["embedded_data_path"])):
        return pd.read_json(_path, orient="records")
    with open(cfg.CONFIG_VALUES["dataset_json_path"], "r", encoding="utf-8") as f:
        data = json.load(f)
    cleaned_data = dp.clean_html_entities(data)
    all_articles = dp.extract_chatbot_interactions(data=cleaned_data)
    df = pd.DataFrame(all_articles)
    df["ada_embedding"] = df.apply(
        lambda x: get_embedding(x, model="text-embedding-3-small"), axis=1
    )
    df.to_json(_path, indent=4, orient="records")
    return df


def get_cosine_similarity(v1: list[float], v2: list[float]):
    # Ensure the vectors are in the correct shape for cosine_similarity function.
    v1 = np.array(v1).reshape(1, -1)
    v2 = np.array(v2).reshape(1, -1)
    return cosine_similarity(v1, v2)[0][0]


def find_closest_entries(
    embedded_data: pd.DataFrame, user_embedding: list[float], top_n: int = 10
) -> pd.DataFrame:
    # Calculate the cosine similarity between user_embedding and all ada_embeddings in the dataframe.
    embedded_data["similarity"] = embedded_data["ada_embedding"].apply(
        lambda x: get_cosine_similarity(x, user_embedding)
    )

    # Sort the dataframe based on the similarity score in descending order.
    closest_entries = embedded_data.sort_values(by="similarity", ascending=False).head(
        top_n
    )
    return closest_entries


def main():
    embedded_data = get_embedded_data()
    user_input = input("Beskriv varen du ønsker å importere?")
    # hester 200kg -> negative case, top match is wrong (under 133kg) and next most similar ones are cars/engine stuff
    user_embedding = get_embedding(user_input)
    closest_entries = find_closest_entries(embedded_data, user_embedding)
    # todo:: think of a logic for refined searching or interaction with user to improve match results
    breakpoint()


def main_two():
    embedded_data = get_embedded_data()
    initial_search = True
    additional_keywords = ""

    while True:  # Start of interaction loop
        if initial_search:
            user_input = input("Beskriv varen du ønsker å importere? ")
            initial_search = False
        else:
            user_input = input(
                "Please provide more details or keywords to refine your search: "
            )

        combined_input = f"{user_input} {additional_keywords}".strip()
        user_embedding = get_embedding(combined_input)
        closest_entries = find_closest_entries(embedded_data, user_embedding)

        print("Top matches:")
        for index, entry in closest_entries.iterrows():
            print(f"{index + 1}: {entry['some_column_with_description']}")

        feedback = (
            input("Are these results relevant? (Yes/No/Refine): ").strip().lower()
        )
        if feedback == "yes":
            print("Great! Found what you were looking for.")
            break
        elif feedback == "no":
            print("Sorry to hear that. Let's try again with more details.")
        elif feedback == "refine":
            additional_keywords += (
                " "
                + input("Provide additional keywords to refine your search: ").strip()
            )
        else:
            print("Invalid input. Please enter Yes, No, or Refine.")


if __name__ == "__main__":
    main()
