import {INetworkConfig} from "../network";

export default abstract class AbstractTransport {

	abstract connect(config: INetworkConfig): Promise<void>;

	abstract disconnect(): Promise<void>;

	abstract send(target: string, message: any): Promise<void>;

	abstract receive(): Promise<any>;

}

export {AbstractTransport}
