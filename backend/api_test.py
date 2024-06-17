import httpx

from api import get_port

API_PORT = get_port()


def output_prompt_response(data: dict) -> str:
    if not data.get("result"):
        return f'Prompt: {data["prompt"]}, Options: {data["options"]}'
    return data["result"]


def main():
    with httpx.Client(timeout=300) as client:
        user_input = input("User input:")
        response = client.get(
            f"http://localhost:{API_PORT}/prompt-input",
            params={"query": user_input},
        )
        data = response.json()
        print(output_prompt_response(data))
        while not data.get("result"):
            user_selection = input("User selection:")
            response = client.get(
                f"http://localhost:{API_PORT}/prompt-input",
                params={"query": user_input, "selection": user_selection},
            )
            data = response.json()
            print(output_prompt_response(data))


if __name__ == "__main__":
    main()
