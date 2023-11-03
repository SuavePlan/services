import AbstractConfig from "./index";
import {Service} from "typedi";

@Service('config')
export default class ConfigService extends AbstractConfig {

    constructor() {
        super();
    }

    private configs: { [key: string]: any } = {};

    setConfig(key: string, value: any) {
        this.configs[key] = value;
    }

    getConfig(key: string): any {
        return this.configs[key];
    }
}
