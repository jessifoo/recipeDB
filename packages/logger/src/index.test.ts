import { logger, Logger, LogLevel } from './index';

describe('@recipedb/logger', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be a singleton', () => {
    const instance1 = Logger.getInstance();
    const instance2 = Logger.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should log info messages', () => {
    logger.info('test message', { foo: 'bar' });
    expect(consoleInfoSpy).toHaveBeenCalled();
    const call = consoleInfoSpy.mock.calls[0][0];
    expect(call).toContain('INFO');
    expect(call).toContain('test message');
  });

  it('should log error messages with error objects', () => {
    const error = new Error('test error');
    logger.error('error occurred', error);
    expect(consoleErrorSpy).toHaveBeenCalled();
    const call = consoleErrorSpy.mock.calls[0];
    expect(call[0]).toContain('ERROR');
    expect(call[0]).toContain('error occurred');
  });

  it('should log warn messages', () => {
    logger.warn('warning message', { level: 'high' });
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleWarnSpy.mock.calls[0][0]).toContain('WARN');
  });

  it('should log debug messages', () => {
    logger.debug('debug message', { details: 'here' });
    expect(consoleDebugSpy).toHaveBeenCalled();
    expect(consoleDebugSpy.mock.calls[0][0]).toContain('DEBUG');
  });

  it('should respect log level filtering', () => {
    const testLogger = Logger.getInstance();
    testLogger.setLevel(LogLevel.WARN);
    
    logger.info('should not appear');
    logger.debug('should not appear');
    logger.warn('should appear');
    logger.error('should appear');

    expect(consoleInfoSpy).not.toHaveBeenCalled();
    expect(consoleDebugSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Reset to INFO for other tests
    testLogger.setLevel(LogLevel.INFO);
  });

  it('should include timestamp in logs', () => {
    logger.info('test');
    const call = consoleInfoSpy.mock.calls[0][0];
    expect(call).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});
