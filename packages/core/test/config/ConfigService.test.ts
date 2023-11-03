import "reflect-metadata"
import ConfigService from "../../src/config/ConfigService";
import Container from "../../src/index";

describe('ConfigService', () => {

    Container.set('config', new ConfigService());

    let configService: ConfigService;

    beforeEach(() => {

        configService = Container.get('config');
    });
    describe('setConfig', () => {
        it('should set a configuration value for a given key', () => {
            configService.setConfig('testConfigKey', 'testConfigValue');
            const result = configService.getConfig('testConfigKey');
            expect(result).toBe('testConfigValue');
        });

        it('should overwrite an existing configuration value for a given key', () => {
            configService.setConfig('testConfigKey', 'testConfigValue');
            configService.setConfig('testConfigKey', 'newConfigValue');
            const result = configService.getConfig('testConfigKey');
            expect(result).toBe('newConfigValue');
        });
    });

    describe('getConfig', () => {
        it('should retrieve a configuration value for a given key', () => {
            configService.setConfig('testConfigKey', 'testConfigValue');
            const result = configService.getConfig('testConfigKey');
            expect(result).toBe('testConfigValue');
        });

        it('should return undefined for a non-existent configuration key', () => {
            const result = configService.getConfig('nonExistentConfigKey');
            expect(result).toBeUndefined();
        });
    });
});
