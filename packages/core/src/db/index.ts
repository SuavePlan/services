import {AbstractClass} from "../service";

export default abstract class AbstractDb extends AbstractClass {
	abstract set(key: string, value: any): Promise<any>;

	abstract get(key: string): Promise<any>;

	abstract update(key: string, value: any): Promise<any>;

	abstract delete(key: string): Promise<boolean>;
}

export { AbstractDb }
