
import { Issuer, Client, TokenSet} from 'openid-client';

export interface PisteAuthConfiguration {
    clientId: string,
    clientSecret: string,
    tokenEndpoint: string,
    authorizationEndpoint: string
}

const pisteIssuer = new Issuer({
    issuer: "PISTE",
    token_endpoint: "https://oauth.piste.gouv.fr/api/oauth/token",
    authorization_endpoint: "https://oauth.piste.gouv.fr/api/oauth/authorize"
});

/**
 * Authentification Service for PISTE APIs
 */
export class PisteAuth {
    client: Client
    currentTokenSet: TokenSet | null;

    constructor(cfg: PisteAuthConfiguration) {
        this.onSettingsUpdated(cfg);
    }

    onSettingsUpdated(cfg: PisteAuthConfiguration) {
        this.currentTokenSet = null;
        const issuer = new Issuer({
            issuer: "PISTE",
            token_endpoint: cfg.tokenEndpoint,
            authorization_endpoint: cfg.authorizationEndpoint
        });

        this.client = new issuer.Client({
            client_id: cfg.clientId,
            client_secret: cfg.clientSecret
        });      
    }

    getTokenAccessor(): (name?: string, scopes?: string[]) => Promise<string> {
        return async function(name?: string, scopes?: string[]): Promise<string> {
            return await this.getToken(name, scopes)
        }.bind(this)
    }

    /**
     * Retourne un jeton d'accès valide.
     * @param name 
     * @param scopes 
     * @returns 
     */
    async getToken(name?: string, scopes?: string[]): Promise<string> {
        if(this.currentTokenSet == null) {
            this.currentTokenSet = await this.client.grant({grant_type: "client_credentials"});
        }

        if(this.currentTokenSet.expired()) {
            this.currentTokenSet = await this.client.grant({grant_type: "client_credentials"});
        }

        return this.currentTokenSet.access_token!;
    }
}