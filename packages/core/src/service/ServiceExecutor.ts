// ServiceExecutor.ts
import ServiceLoader from './ServiceLoader';

class ServiceExecutor {
	public async executeService(id: string, payload: any): Promise<any> {
		const service = ServiceLoader.getService(id);

		if (!service) {
			throw new Error(`Service with ID '${id}' not found.`);
		}

		return service.execute(payload);
	}
}

export default new ServiceExecutor();
