// ServiceLoader.ts
import fs from 'fs';
import path from 'path';
import { IService } from './';

class ServiceLoader {
	private serviceRegistry: { [id: string]: IService } = {};

	public async loadServices(directory: string): Promise<void> {
		const files = fs.readdirSync(directory);

		for (const file of files) {
			if (file.endsWith('.ts')) {
				const modulePath = path.join(directory, file);
				const serviceModule = await import(modulePath);

				if ('default' in serviceModule) {
					const service: IService = new serviceModule.default();
					if (await service.isAvailable()) {
						this.serviceRegistry[service.id] = service;
						await service.initialize();
						console.log(`Service registered: ${service.id}`);
					}
				}
			}
		}
	}

	public getService(id: string): IService | undefined {
		return this.serviceRegistry[id];
	}
}

export default new ServiceLoader();
