import { Article } from "legifrance";
import { marked } from "marked";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { TFolder, moment } from "obsidian";

export interface PointDeControle {
    nom: string,
    source: string,
    date_source: string,
    article: string,
    thème: string,
    sous_thème: string,
    
    /**
     * Prescription au format MD
     * @date 10/30/2023 - 11:38:11 AM
     *
     * @type {string}
     */
    prescription: string,
    notes: string,
    constats: string
}


export function articleToPointDeControle(article: Article) : PointDeControle {
    return {
        nom: `Article ${article.num}`,
        date_source: moment.unix(Number(article.dateDebut)).format("DD/MM/YYYY"),
        source: article?.textTitles?.at(0)?.nature == "ARRETE" ? "Arrêté Ministériel" : article?.textTitles?.at(0)?.titreLong!,
        article: `${article.num}`,
        thème: "Autre",
        sous_thème: "...",
        prescription: NodeHtmlMarkdown.translate(article?.texteHtml!),
        notes: "",
        constats: ""
    }
}

export function pdcToMarkdown(pdc: PointDeControle) : string {
    return `
--- début-pdc ---
# ${pdc.nom}
[source:: ${pdc.source}]
[date_source:: ${pdc.date_source}]
[thème:: ${pdc.thème}]
[sous_thème:: ${pdc.sous_thème}]
[article:: ${pdc.article}]

## Prescription
${pdc.prescription || ""}

## Notes
${pdc.notes || ""}

## Constats
${pdc.constats || ""}

--- fin-pdc ---
`
}

export class PointDeControleProcessor {
    constructor(src: string) {
        let mdTokens = marked.lexer(src);
    }
}