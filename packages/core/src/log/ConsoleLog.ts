import AbstractLog from "./index";
import {Service} from "typedi";

@Service('log.console')
export default class ConsoleLog extends AbstractLog {
    log(message?: any, ...optionalParams: any[]): void {
        console.log(message, ...optionalParams);
    }

}
