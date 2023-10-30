import { TFolder } from "obsidian";
import * as georisques from 'georisques';

export interface GeorisquesConfiguration {
    basePath: string
}

export class Georisques {
    api: georisques.InstallationsClassesApi;

    constructor(cfg: GeorisquesConfiguration) {
        this.api = new georisques.InstallationsClassesApi(undefined, cfg.basePath);
    }

    onSettingsUpdated(cfg: GeorisquesConfiguration) {
        this.api = new georisques.InstallationsClassesApi(undefined, cfg.basePath);
    }

    async getInstallationClasseeByCode(code: string): Promise<georisques.InstallationClassee | undefined> {
        console.log(code);
        const resp = await this.api.rechercherAiotsParGeolocalisationUsingGET(undefined, undefined, [code]);
        return resp.data.data?.at(0)
    }
}