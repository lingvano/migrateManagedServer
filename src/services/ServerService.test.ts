import ServerService from './ServerService';
import config from '../lib/config';

describe('ServerService', () => {
  const skipCi = config.environment === 'ci' ? it.skip : it;

  it('Can create a new instance of ServerService', () => {
    const ServerServiceInstance = new ServerService();
    expect(ServerServiceInstance).toBeDefined();
  });

  skipCi('Can create a SSH connection to the origin server', async () => {
    const ServerServiceInstance = new ServerService();

    const originSSH = await ServerServiceInstance.connectTo('origin');
    expect(originSSH.isConnected()).toEqual(true);
    originSSH.dispose();
  });
});
