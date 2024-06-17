import os

import pandas as pd
from flask import Flask, jsonify, request, session
from flask_cors import cross_origin

from main import find_closest_entries, get_embedded_data, get_embedding

app = Flask(__name__)
app.config["SECRET_KEY"] = "xC#D=Ms<2-XnMptX"
EMBEDDED_DATA = get_embedded_data()
TOP_N = 30


def get_port() -> int:
    try:
        return int(os.environ["BACKEND_API_PORT"])
    except KeyError:
        return 5001


def get_host() -> str:
    try:
        return os.environ["BACKEND_API_HOST"]
    except KeyError:
        return "0.0.0.0"


@app.route("/process-input", methods=["GET"])
@cross_origin()
def get_process_input():
    """
    API endpoint that receives user input, processes it, and returns a result.
    """
    # Get user input from the request JSON body
    user_input = request.args.get("query").strip()
    if user_input is None:
        return jsonify({"error": "Missing input"}), 400
    embedded_input = get_embedding(text_input=user_input)
    matches = find_closest_entries(
        embedded_data=EMBEDDED_DATA, user_embedding=embedded_input, top_n=TOP_N
    )
    return jsonify(matches.to_dict(orient="records"))


@app.route("/prompt-input", methods=["GET"])
@cross_origin()
def get_prompt_input():
    """
    API endpoint that receives user input for prompting and returns a result.
    """
    # Get user input from the request JSON body
    user_input = request.args.get("query").strip()
    user_selection = request.args.get("selection", type=int)

    if user_input is None:
        return jsonify({"error": "Missing input"}), 400
    if (
        "session_data" not in session
        or session["session_data"].get("last_query") != user_input
    ):
        session["session_data"] = {"last_query": user_input}

    # Start the process or get the last state
    if not session["session_data"].get("last_matches"):
        embedded_input = get_embedding(text_input=user_input)
        matches = find_closest_entries(
            embedded_data=EMBEDDED_DATA, user_embedding=embedded_input, top_n=TOP_N
        )
        # embedding values are no longer needed
        matches = matches.drop(columns=["ada_embedding"])
        session["session_data"]["last_matches"] = matches.to_dict("records")
        columns_to_prompt = ["avsnitt", "kapittel", "posisjon", "vare_description"]
        session["session_data"]["columns_to_prompt"] = columns_to_prompt
    else:
        matches = pd.DataFrame(session["session_data"]["last_matches"])
        columns_to_prompt = session["session_data"]["columns_to_prompt"]

    # Apply filtering based on user selection if there was a previous prompt
    if user_selection is not None and "last_prompted" in session["session_data"]:
        last_prompted = session["session_data"]["last_prompted"]
        value_to_filter = matches[last_prompted].unique()[user_selection]
        matches = matches[matches[last_prompted] == value_to_filter]
        # Update the last matches in the session
        session["session_data"]["last_matches"] = matches.to_dict("records")

    # Iterate over the columns to prompt
    for column in columns_to_prompt:
        unique_values = matches[column].unique()
        if len(unique_values) > 1:
            session["session_data"]["last_prompted"] = column
            # Provide the user with the options for this column
            options = {str(i): val for i, val in enumerate(unique_values)}
            session.modified = True
            return jsonify(
                {
                    "prompt": f"Hvilken/Hvilket {column} beskriver din katogeri best?",
                    "options": options,
                }
            )
        elif len(unique_values) == 1:
            # If there's only one option, filter by it and move to the next column
            matches = matches[matches[column] == unique_values[0]]

    # If there are no more columns to prompt, return the final matches
    del session["session_data"]["columns_to_prompt"]
    del session["session_data"]["last_prompted"]

    session.modified = True  # Make sure to mark the session as modified
    final_record = matches.iloc[0].to_dict()
    result_string = (
        f"Ditt HS-nummer for <{final_record['vare_description']}> er <{final_record['vare_hsNummer']}>. "
        f"Den tilhører avsnitt <{final_record['avsnitt']}>, "
        f"kapittel <{final_record['kapittel']}>, "
        f"posisjon <{final_record['posisjon']}>"
    )
    if final_record.get("underposisjon"):
        result_string += f", underposisjon <{final_record['underposisjon']}> (<{final_record['underposisjon_hsNummer']}>)"
    if final_record.get("underkapittel"):
        result_string += f" og underkapittel <{final_record['underkapittel']}>"
    session.clear()
    response = jsonify({"result": result_string})
    response.set_cookie("session", "", expires=0)
    return response


if __name__ == "__main__":
    app.run(host=get_host(), port=get_port())
