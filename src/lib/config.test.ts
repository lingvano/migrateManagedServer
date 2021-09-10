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

  maybe('Added environment variables for ssh access to destination server', () => {
    expect(typeof config.destinationHost).toEqual('string');
    expect(typeof config.destinationPassword).toEqual('string');
    expect(typeof config.destinationPort).toEqual('number');
    expect(typeof config.destinationUserName).toEqual('string');

    expect(config.destinationHost.length).toBeGreaterThan(0);
    expect(config.destinationPassword.length).toBeGreaterThan(0);
    expect(config.destinationPort).toBeGreaterThan(0);
    expect(config.destinationUserName.length).toBeGreaterThan(0);
  });
});
