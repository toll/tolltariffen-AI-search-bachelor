import configparser
import os
import os.path as path

from ._types import Config

CONFIG_VALUES: Config = Config(
    open_ai_token="",
    embedded_data_path=path.abspath(
        path.join(__file__, "../../dataset/embedded_data.json")
    ),
    training_file_id="",
    training_file_chat_id="",
    test_training_file_chat_id="",
    fine_tuned_model_babbage="",
    fine_tuned_model_chat="",
    dataset_json_path=path.abspath(
        path.join(__file__, "../../dataset/tolltariffstruktur.json")
    ),
    dataset_json_flattened_path=path.abspath(
        path.join(__file__, "../../dataset/tolltariffstruktur_flattened.jsonl")
    ),
    dataset_json_flattened_chat_path=path.abspath(
        path.join(__file__, "../../dataset/tolltariffstruktur_flattened_chat.jsonl")
    ),
    dataset_json_flattened_test_chat_path=path.abspath(
        path.join(__file__, "../../dataset/testing_flattened_chat.jsonl")
    ),
    dataset_json_flattened_test_path=path.abspath(
        path.join(__file__, "../../dataset/testing_flattened.jsonl")
    ),
)


def check_config():
    if os.environ.get("PRODUCTION_TOLL_ETATEN"):
        CONFIG_VALUES["open_ai_token"] = os.environ["open_ai_token"]
        CONFIG_VALUES["training_file_id"] = os.environ["training_file_id"]
        return  # skip, values are injected from CI
    _config_path = path.abspath(path.join(__file__, "../config.ini"))
    _template_path = path.abspath(path.join(__file__, "../config.template.ini"))
    if not path.exists(_config_path):
        with open(_template_path, "r") as template_file:
            with open(_config_path, "w") as config_file:
                for line in template_file.readlines():
                    config_file.write(line)
        print(
            f"Config file was not found!"
            f"\nA config file has been created for you. "
            f"\nPlease fill it out: {_config_path}"
        )
        exit(-1)
    config = configparser.ConfigParser()
    config.read(_config_path)
    for section in config.sections():
        for key in config[section]:
            # noinspection PyTypedDict
            CONFIG_VALUES[key] = config[section][key]
