import { Article } from "legifrance";
import { marked } from "marked";
import { TFolder } from "obsidian";

export interface PointDeControle {
    nom: string,
    source: string,
    date_source: string,
    article: string,
    thème: string,
    sous_thème: string,
    prescription: string,
    notes: string,
    constats: string
}

export function articleToPointDeControle(article: Article) : PointDeControle {
    
}

export function toMarkdown(pdc: PointDeControle) : string {
    return `# ${pdc.nom}

## Prescription

${pdc.prescription || ""}

## Notes

${pdc.notes || ""}

## Constats

${pdc.constats || ""}
`
}

export class PointDeControleProcessor {
    constructor(src: string) {
        let mdTokens = marked.lexer(src);
    }
}