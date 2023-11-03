export interface INetworkConfig {
    host?: string;
    port?: number;
}

export interface INetwork {
    connect(config: INetworkConfig): Promise<void>;

    disconnect(): Promise<void>;

    broadcast(message: any): Promise<void>;

    send(targetId: string, message: any): Promise<void>;

    receive(): Promise<any>;
}

export default abstract class AbstractNetwork implements INetwork {
    abstract connect(config: INetworkConfig): Promise<void>;

    abstract disconnect(): Promise<void>;

    abstract broadcast(message: any): Promise<void>;

    abstract send(targetId: string, message: any): Promise<void>;

    abstract receive(): Promise<any>;

}

export {AbstractNetwork}