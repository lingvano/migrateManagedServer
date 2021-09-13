import config from './config';

describe('Valid configuration set up', () => {
  const skipCi = config.environment === 'ci' ? it.skip : it;

  it('Specified environment', () => {
    expect(typeof config.environment).toEqual('string');
  });

  const servers: ['origin', 'destination'] = ['origin', 'destination'];
  servers.map((server) => {
    skipCi(`Added environment variables for ssh access to ${server} server`, () => {
      expect(typeof config[server].host).toEqual('string');
      expect(typeof config[server].password).toEqual('string');
      expect(typeof Number(config[server].port)).toEqual('number');
      expect(typeof config[server].userName).toEqual('string');

      expect(config[server].host.length).toBeGreaterThan(0);
      expect(config[server].password.length).toBeGreaterThan(0);
      expect(Number(config[server].port)).toBeGreaterThan(0);
      expect(config[server].userName.length).toBeGreaterThan(0);
      expect(typeof config[server].db.host).toEqual('string');
      expect(typeof config[server].db.password).toEqual('string');
      expect(typeof Number(config[server].db.port)).toEqual('number');
      expect(typeof config[server].db.userName).toEqual('string');
      expect(typeof config[server].db.name).toEqual('string');

      expect(config[server].db.host.length).toBeGreaterThan(0);
      expect(config[server].db.password.length).toBeGreaterThan(0);
      expect(Number(config[server].db.port)).toBeGreaterThan(0);
      expect(config[server].db.userName.length).toBeGreaterThan(0);
      expect(config[server].db.name.length).toBeGreaterThan(0);
    });
  });
});
