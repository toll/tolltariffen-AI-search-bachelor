import typing


class Article(typing.TypedDict):
    avsnitt: str
    kapittel: str
    posisjon: str
    underposisjon: typing.NotRequired[str]
    underposisjon_hsNummer: typing.NotRequired[str]
    vare_description: str
    vare_hsNummer: str
