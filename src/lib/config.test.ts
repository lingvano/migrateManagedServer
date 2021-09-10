import config from './config';

describe('Valid configuration set up', () => {
  const maybe = config.environment === 'ci' ? it.skip : it;

  it('Specified environment', () => {
    expect(typeof config.environment).toEqual('string');
  });

  const servers: ['origin', 'destination'] = ['origin', 'destination'];
  servers.map((server) => {
    maybe(`Added environment variables for ssh access to ${server} server`, () => {
      expect(typeof config[server].host).toEqual('string');
      expect(typeof config[server].password).toEqual('string');
      expect(typeof config[server].port).toEqual('number');
      expect(typeof config[server].userName).toEqual('string');

      expect(config[server].host.length).toBeGreaterThan(0);
      expect(config[server].password.length).toBeGreaterThan(0);
      expect(config[server].port).toBeGreaterThan(0);
      expect(config[server].userName.length).toBeGreaterThan(0);
    });
  });
});
