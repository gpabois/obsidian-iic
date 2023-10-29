import { Article } from "legifrance";
import { App, Modal } from "obsidian";

export class ChargerArticleModal extends Modal{
    article: Article | undefined

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
        contentEl.innerHTML = ``
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}