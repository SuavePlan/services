export default abstract class AbstractLog {
	abstract log(message?: any, ...optionalParams: any[]): void

	info(message?: any, ...optionalParams: any[]): void {
		this.log(`[INFO] ${message}`, ...optionalParams);
	}

	warn(message?: any, ...optionalParams: any[]): void {
		this.log(`[WARN] ${message}`, ...optionalParams);
	}

	error(message?: any, ...optionalParams: any[]): void {
		this.log(`[ERROR] ${message}`, ...optionalParams);
	}

}

export {AbstractLog}
