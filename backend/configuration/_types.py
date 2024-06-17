import typing


class Config(typing.TypedDict):
    open_ai_token: str
    embedded_data_path: str
    training_file_id: str
    training_file_chat_id: str
    test_training_file_chat_id: str
    dataset_json_path: str
    dataset_json_flattened_path: str
    dataset_json_flattened_chat_path: str
    dataset_json_flattened_test_path: str
    fine_tuned_model_babbage: str
    fine_tuned_model_chat: str
    dataset_json_flattened_test_chat_path: str
