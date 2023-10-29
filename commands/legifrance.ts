import { Legifrance } from "legi";
import { Command, Editor, MarkdownView } from "obsidian";

export function chargerArticleCmd(lg: Legifrance) : Command {
    return {
        id: 'iic-legifrance-charger-article',
        name: "IIC - Charger article depuis Légifrance",
        editorCallback: async (editor: Editor, view: MarkdownView) => {
            try {
                const url = editor.getSelection();
                console.log("IIC - Charge l'article dont l'url est " + url);
                const article = await lg.getArticleFromUrl(url);
                editor.replaceSelection(JSON.stringify(article));
            } catch(err) {
                editor.replaceRange(err, editor.getCursor());
                console.error(err);
            }

        }
    }
}