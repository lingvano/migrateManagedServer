import config from './config';

describe('Valid configuration set up', () => {
  const maybe = config.environment === 'ci' ? it.skip : it;

  it('Specified environment', () => {
    expect(typeof config.environment).toEqual('string');
  });

  maybe('Added environment variables for ssh access to origin server', () => {
    expect(typeof config.originHost).toEqual('string');
    expect(typeof config.originPassword).toEqual('string');
    expect(typeof config.originPort).toEqual('number');
    expect(typeof config.originUserName).toEqual('string');

    expect(config.originHost.length).toBeGreaterThan(0);
    expect(config.originPassword.length).toBeGreaterThan(0);
    expect(config.originPort).toBeGreaterThan(0);
    expect(config.originUserName.length).toBeGreaterThan(0);
  });
});