import { Georisques } from "aiot";
import { articleToPointDeControle, pdcToMarkdown } from "inspection";
import { Legifrance } from "legi";
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'
import { Command, Editor, MarkdownView } from "obsidian";

export function syncAIOTAvecGéorisquesCmd(g: Georisques) {
    return {
        id: 'iic-sync-aiot-géorisques',
        name: "IIC - Synchronise un AIOT depuis Géorisques",
        editorCallback: async (editor: Editor, view: MarkdownView) => {
            try {
                let codeAIOT = view.app.metadataCache.getFileCache(view.file!)?.frontmatter?.['code_aiot']!;
                const aiot = (await g.getInstallationClasseeByCode(codeAIOT))!;
                
                view.app.fileManager.processFrontMatter(view.file!, (fm) => {
                    fm["nom"] = aiot.raisonSociale;
                    fm["régime"] = aiot.regime;
                    fm["rubriques"] = aiot.rubriques?.map((rubrique) => rubrique.numeroRubrique + (rubrique.alinea ? `-${rubrique.alinea}` : "") + ` ${rubrique.regimeAutoriseAlinea?.at(0)}`);
                    fm["commune"] = aiot.commune;
                    fm["adresse"] = [aiot.adresse1 || "", aiot.adresse2 || "", aiot.adresse3 || ""].join(" ")
                });


            } catch(err) {
                console.error(err);
                alert(err);
            }

        }
    }
}

export function nouveauPointDeControleCmd() : Command {
    return {
        id: 'iic-nouveau-pdc',
        name: "IIC - Ajouter un point de contrôle",
        editorCallback: async (editor: Editor, view: MarkdownView) => {
            try {
                const url = editor.getSelection();
                const block = pdcToMarkdown({
                    nom: "Point de contrôle",
                    source: "Arrêté Ministériel/Arrêté Préfectoral/Code de l'environnement",
                    date_source: "XX/XX/XXXX",
                    thème: "Autre",
                    sous_thème: "...",
                    article: "XX",
                    notes: "",
                    prescription: "",
                    constats: ""
                });           
                editor.replaceSelection(block, editor.getSelection());
            } catch(err) {
                console.error(err);
                alert(err);
            }

        }
    }
}

export function chargerArticleEnTantQuePointDeControleCmd(lg: Legifrance) : Command {
    return {
        id: 'iic-inspection-charger-article-as-pdc',
        name: "IIC - Charger article depuis Légifrance en tant que point de contrôle",
        editorCallback: async (editor: Editor, view: MarkdownView) => {
            try {
                const url = editor.getSelection();
                const article = await lg.getArticleFromUrl(url);
                const block = pdcToMarkdown(articleToPointDeControle(article!));           
                editor.replaceSelection(block, editor.getSelection());
            } catch(err) {
                console.error(err);
                alert(err);
            }

        }
    }
}