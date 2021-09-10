import { NodeSSH } from 'node-ssh';
import config from './../lib/config';

interface Credentials {
  host: string;
  username: string;
  password: string;
}

export default class ServerService {
  async connectTo(server: 'origin' | 'destination') {
    const ssh = new NodeSSH();

    const credentials: Credentials = {
      host: '',
      username: '',
      password: '',
    };

    if (server === 'origin') {
      credentials.host = config.originHost;
      credentials.username = config.originUserName;
      credentials.password = config.originPassword;
    }

    if (server === 'destination') {
      // Setup credentials destination
    }

    await ssh.connect({ ...credentials });
    return ssh;
  }
}
