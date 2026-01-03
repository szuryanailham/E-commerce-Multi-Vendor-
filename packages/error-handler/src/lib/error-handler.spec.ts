import { errorHandler } from './error-handler.js';

describe('errorHandler', () => {
  it('should work', () => {
    expect(errorHandler()).toEqual('error-handler');
  });
});
