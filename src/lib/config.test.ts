import config from './config';

describe('Valid configuration set up', () => {
  const maybe = config.environment === 'ci' ? it.skip : it;

  it('Specified environment', () => {
    expect(typeof config.environment).toEqual('string');
  });

  const servers = ['origin', 'destination'];
  servers.map((server) => {
    maybe(`Added environment variables for ssh access to ${server} server`, () => {
      expect(typeof config.origin.host).toEqual('string');
      expect(typeof config.origin.password).toEqual('string');
      expect(typeof config.origin.port).toEqual('number');
      expect(typeof config.origin.userName).toEqual('string');

      expect(config.origin.host.length).toBeGreaterThan(0);
      expect(config.origin.password.length).toBeGreaterThan(0);
      expect(config.origin.port).toBeGreaterThan(0);
      expect(config.origin.userName.length).toBeGreaterThan(0);
    });
  });
});
