import * as lg from 'legifrance';
import { PisteAuth } from 'piste';


/**
 * Récupère l'article depuis son identifiant
 * @param articleId 
 */
export async function getArticleFromId(cfg: lg.Configuration, articleId: string): Promise<lg.Article | undefined> {
    let ctrl = new lg.ConsultControllerApi(cfg);
    let result = await ctrl.getArticleUsingPOST({id: articleId});
    return result.data.article;
}

export interface LegifranceConfiguration {
    basePath: string,
}

export class Legifrance {
    consult: lg.ConsultControllerApi;
    authClient: PisteAuth;

    constructor(authClient: PisteAuth, cfg: LegifranceConfiguration) {
        this.authClient = authClient;
        
        let apiCfg = new lg.Configuration({
            basePath: cfg.basePath,
            accessToken: this.authClient.getTokenAccessor() as (name?: string, scopes?: string[]) => Promise<string>
        });

        this.consult = new lg.ConsultControllerApi(apiCfg)
    }

    onSettingsUpdated(cfg: LegifranceConfiguration) {
        let apiCfg = new lg.Configuration({
            basePath: cfg.basePath,
            accessToken: this.authClient.getTokenAccessor() as (name?: string, scopes?: string[]) => Promise<string>
        });

        this.consult = new lg.ConsultControllerApi(apiCfg)
    };

    /**
     * Récupère l'article depuis son identifiant
     * @param articleId 
     */
    async getArticleFromId(articleId: string): Promise<lg.Article | undefined> {
        const result = await this.consult.getArticleUsingPOST({id: articleId});
        return result.data.article;
    }

    /**
     * Récupère l'article depuis son URL
     * @param url 
     * @example: "https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000034429291"
     */
    async getArticleFromUrl(url: string): Promise<lg.Article | undefined>  {
        if(url.startsWith("https://www.legifrance.gouv.fr/") == false) {
            throw Error("Invalid URL");
        }

        const articleId = url.split('/').pop()!;

        return await this.getArticleFromId(articleId);
    }
}