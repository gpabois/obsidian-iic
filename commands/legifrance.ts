import { Legifrance } from "legi";
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'
import { Command, Editor, MarkdownView } from "obsidian";

export function chargerArticleCmd(lg: Legifrance) : Command {
    return {
        id: 'iic-legifrance-charger-article',
        name: "IIC - Charger article depuis Légifrance",
        editorCallback: async (editor: Editor, view: MarkdownView) => {
            try {
                const url = editor.getSelection();
                const article = await lg.getArticleFromUrl(url);
                console.log(article);
                const block = `
# ${article?.textTitles?.at(0)?.titreLong}
## Article ${article?.num}
[source:: ${article?.textTitles?.at(0)?.nature}]
[date:: ${article?.dateDebut}]
${NodeHtmlMarkdown.translate(article?.texteHtml!)}
                `
                editor.replaceRange(block, editor.getCursor());
            } catch(err) {
                console.error(err);
                alert(err);
            }

        }
    }
}