import ConsoleLog from '../../src/log/ConsoleLog';

describe('ConsoleLog', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        // Mock the console.log method
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {
        });
    });

    afterEach(() => {
        // Restore the original console.log method
        consoleLogSpy.mockRestore();
    });

    it('should log a message to the console', () => {
        const logger = new ConsoleLog();
        const message = 'Test message';

        logger.log(message);

        // Expect that console.log was called with the message
        expect(consoleLogSpy).toHaveBeenCalledWith(`${message}`);
    });

    it('should log a message to the console', () => {
        const logger = new ConsoleLog();
        const message = 'Test message';

        logger.warn(message);

        // Expect that console.log was called with the message
        expect(consoleLogSpy).toHaveBeenCalledWith(`[WARN] ${message}`);
    });

    it('should log a message to the console', () => {
        const logger = new ConsoleLog();
        const message = 'Test message';

        logger.info(message);

        // Expect that console.log was called with the message
        expect(consoleLogSpy).toHaveBeenCalledWith(`[INFO] ${message}`);
    });


    it('should log a message to the console', () => {
        const logger = new ConsoleLog();
        const message = 'Test message';

        logger.error(message);

        // Expect that console.log was called with the message
        expect(consoleLogSpy).toHaveBeenCalledWith(`[ERROR] ${message}`);
    });


    it('should log multiple parameters to the console', () => {
        const logger = new ConsoleLog();
        const message = 'Test message';
        const param1 = 42;
        const param2 = {key: 'value'};

        logger.log(message, param1, param2);

        // Expect that console.log was called with the message and parameters
        expect(consoleLogSpy).toHaveBeenCalledWith(message, param1, param2);
    });
});
