
import { Issuer, Client, TokenSet, custom} from 'openid-client';
import {HttpsProxyAgent} from 'hpagent';
import axios from 'axios';

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
    cfg: PisteAuthConfiguration;

    constructor(cfg: PisteAuthConfiguration) {    
        this.onSettingsUpdated(cfg);
    }

    onSettingsUpdated(cfg: PisteAuthConfiguration) {
        this.currentTokenSet = null;
        this.cfg = cfg;    
    }

    async requestToken(): Promise<TokenSet> {
        const resp = await axios.post(this.cfg.tokenEndpoint, `grant_type=client_credentials&client_id=${this.cfg.clientId}&client_secret=${this.cfg.clientSecret}&scope=openid`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        return new TokenSet(resp.data);
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
            this.currentTokenSet = await this.requestToken()
        }

        if(this.currentTokenSet.expired()) {
            this.currentTokenSet = await this.requestToken();
        }

        return this.currentTokenSet.access_token!;
    }
}