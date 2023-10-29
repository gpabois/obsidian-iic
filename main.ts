import { créerAiot } from 'aiot';
import { chargerArticleCmd } from 'commands/legifrance';
import { créerInspection } from 'inspection';
import { Legifrance } from 'legi';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFolder } from 'obsidian';
import { PisteAuth } from 'piste';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	piste: {
		clientId: string,
		clientSecret: string
		tokenEndpoint: string,
		authorizationEndpoint: string,
	},
	georisques: {
		basePath: string
	},
	legifrance: {
		basePath: string
	},
	inspection: {
		canvasTemplatePath: string
	}
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	piste: {
		clientId: "client_id",
		clientSecret: "client_secret",
		tokenEndpoint: "https://sandbox-oauth.piste.gouv.fr/api/oauth/token",
		authorizationEndpoint: "https://sandbox-oauth.piste.gouv.fr/api/oauth/authorize"
	},
	georisques: {
		basePath: "https://www.georisques.gouv.fr/"
	},
	legifrance: {
		basePath: "http://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app"
	},
	inspection: {
		canvasTemplatePath: ""
	}
}

export default class InspectionPlugin extends Plugin {
	settings: MyPluginSettings;

	pisteAuth: PisteAuth;
	legifrance: Legifrance;

	async onload() {
		// Load settings
		await this.loadSettings();

		// PISTE OAuth Client to request Legifrance API
		this.pisteAuth = new PisteAuth(this.settings.piste);

		// Legifrance service
		this.legifrance = new Legifrance(this.pisteAuth, this.settings.legifrance);
		
		// This adds a simple command that can be triggered anywhere
		this.addCommand(chargerArticleCmd(this.legifrance));
		
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item
					.setSection("iic")
					.setTitle("Nouvel AIOT")
					.setIcon("document")
					.onClick(async() => {
						await créerAiot(file as TFolder);
					});
				});

				menu.addItem((item) => {
					item
					.setSection("iic")
					.setTitle("Nouvelle inspection")
					.setIcon("document")
					.onClick(async() => {
						await créerInspection(file as TFolder);
					});
				});
			})
		)

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new InspectionSettingTab(this.app, this));

		this

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class InspectionSettingTab extends PluginSettingTab {
	plugin: InspectionPlugin;

	constructor(app: App, plugin: InspectionPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		
		new Setting(containerEl)
		.setName("PISTE - Client ID")
		.setDesc("Identifiant du client pour l'OAuth PISTE")
		.addText(text => text
			.setPlaceholder("")
			.setValue(this.plugin.settings.piste.clientSecret)
			.onChange(async(value) => {
				this.plugin.settings.piste.clientId = value;
				this.plugin.pisteAuth.onSettingsUpdated(this.plugin.settings.piste);
				await this.plugin.saveSettings();
			})
		);
		
		new Setting(containerEl)
		.setName("PISTE - Client secret")
		.setDesc("Secret du client pour l'OAuth PISTE")
		.addText(text => text
			.setPlaceholder("")
			.setValue(this.plugin.settings.piste.clientSecret)
			.onChange(async(value) => {
				this.plugin.settings.piste.clientSecret = value;
				this.plugin.pisteAuth.onSettingsUpdated(this.plugin.settings.piste);
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName("PISTE - Token endpoint")
		.setDesc("Endpoint pour récupérer un jeton")
		.addText(text => text
			.setPlaceholder("")
			.setValue(this.plugin.settings.piste.tokenEndpoint)
			.onChange(async(value) => {
				this.plugin.settings.piste.tokenEndpoint = value;
				this.plugin.pisteAuth.onSettingsUpdated(this.plugin.settings.piste);
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName("PISTE - Authorization endpoint")
		.setDesc("Endpoint pour l'authorization")
		.addText(text => text
			.setPlaceholder("")
			.setValue(this.plugin.settings.piste.authorizationEndpoint)
			.onChange(async(value) => {
				this.plugin.settings.piste.authorizationEndpoint = value;
				this.plugin.pisteAuth.onSettingsUpdated(this.plugin.settings.piste);
				await this.plugin.saveSettings();
			})
		);


		new Setting(containerEl)
		.setName("Légifrance - Chemin de base")
		.setDesc("Lien vers le chemin de base de l'API Légifrance.")
		.addText(text => text
			.setPlaceholder("")
			.setValue(this.plugin.settings.legifrance.basePath)
			.onChange(async(value) => {
				this.plugin.settings.legifrance.basePath = value;
				this.plugin.legifrance.onSettingsUpdated(this.plugin.settings.legifrance);
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName("Géorisques - Chemin de base")
		.setDesc("Lien vers le chemin de base de l'API Géorisques.")
		.addText(text => text
			.setPlaceholder("")
			.setValue(this.plugin.settings.georisques.basePath)
			.onChange(async(value) => {
				this.plugin.settings.georisques.basePath = value;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName("Inspection - Canevas")
		.setDesc("Modèle de canevas d'inspection")
		.addText(text => text
			.setPlaceholder("")
			.setValue(this.plugin.settings.inspection.canvasTemplatePath)
			.onChange(async(value) => {
				this.plugin.settings.inspection.canvasTemplatePath = value;
				await this.plugin.saveSettings();
			}))
	}
}
