/**
 * @file logger.utils.test.ts
 * @layer utils
 * @description Logger gates debug in production (P-17).
 */

import { logDebug, logError } from '@/utils/logger.utils';

describe('logger.utils', () => {
  const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

  afterEach(() => {
    debugSpy.mockClear();
    errorSpy.mockClear();
  });

  afterAll(() => {
    debugSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('logError always emits', () => {
    logError('boom');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('logDebug emits in test (__DEV__)', () => {
    logDebug('dev-only');
    expect(debugSpy).toHaveBeenCalled();
  });
});
