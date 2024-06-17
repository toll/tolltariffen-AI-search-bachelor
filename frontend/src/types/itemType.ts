export type article = {
    avsnitt: string,
    kapittel: string,
    posisjon: string,
    underposisjon: string | null,
    underposisjon_hsNummer: string | null,
    vare_description: string,
    vare_hsNummer: string,
    underkapittel: string | null,
    ada_embedding: number[]
    similarity: number
}
