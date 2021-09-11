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
      host: config[server].host,
      username: config[server].userName,
      password: config[server].password,
    };

    await ssh.connect({ ...credentials });
    return ssh;
  }

  async downloadOriginFolder() {
    const originFolderPath = config.origin.path + config.origin.folder;

    await this.getFolderFromOrigin(originFolderPath, config.origin.folder);
  }

  async getFolderFromOrigin(folderPath: string, folderName: string) {
    const compressedFileName = folderName + '.tar.gz';
    const localFilePath = config.downloadsDir + compressedFileName;

    const ssh = await this.connectTo('origin');
    await ssh.execCommand(`tar -czvf ${compressedFileName} ${folderName}`);
    await ssh.getFile(localFilePath, compressedFileName);
    ssh.dispose();
  }

  async uploadFileToOrigin(localFile: string, destinationFile: string) {
    const ssh = await this.connectTo('destination');
    await ssh.putFile(localFile, config.destination.path + destinationFile);
    // TODO: Untar file
    ssh.dispose();
  }
}
