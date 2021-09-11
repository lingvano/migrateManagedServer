import { fileExists } from './../helpers/fileExists';
import { NodeSSH } from 'node-ssh';
import config from './../lib/config';
import logger from './../lib/logger';

interface Credentials {
  host: string;
  username: string;
  password: string;
}

interface Folder {
  path: string;
  name: string;
  extension?: undefined | '';
}

interface File {
  path: string;
  name: string;
  extension: string | 'tar.gz';
}

type Server = 'origin' | 'destination';

export default class ServerService {
  async connectTo(server: Server) {
    const ssh = new NodeSSH();

    const credentials: Credentials = {
      host: config[server].host,
      username: config[server].userName,
      password: config[server].password,
    };

    logger.info(`Trying to connect to '${server}' ...`);
    await ssh.connect({ ...credentials });
    logger.info(`Successfully connected to '${server}'`);
    return ssh;
  }

  async downloadOriginFolder() {
    const folder = {
      path: config.origin.path + config.origin.folder,
      name: config.origin.folder,
    };

    await this.getFolderFromServer(folder, 'origin');
  }

  async getFolderFromServer(folder: Folder, server: Server): Promise<Folder> {
    const compressedFileName = folder.name + '.tar.gz';
    const localFilePath = config.downloadsDir + compressedFileName;

    const ssh = await this.connectTo(server);
    const tarCommand = `tar -czvf ${compressedFileName} ${folder.name}`;
    logger.info(`Doing: ${tarCommand}`);
    await ssh.execCommand(tarCommand);

    logger.info(`Doing: getFile(${localFilePath}, ${compressedFileName})`);
    await ssh.getFile(localFilePath, compressedFileName);
    ssh.dispose();

    const hasDownloaded = await fileExists(localFilePath);
    if (!hasDownloaded) {
      throw new Error(`Could not find a file at: ${localFilePath}`);
    }
    logger.info(`Downloaded file from '${server}' to '${localFilePath}'`);
    return {
      path: config.downloadsDir,
      name: compressedFileName,
    };
  }

  async uploadFileToServer(localFile: File, remoteFile: File, server: Server) {
    const ssh = await this.connectTo(server);

    const localPath = this.getPath(localFile);
    const remotePath = this.getPath(remoteFile);

    logger.info(`Trying to putFile(localPath: '${localPath}', remotePath: '${remotePath}')`);
    await ssh.putFile(localPath, remotePath);
    ssh.dispose();
  }

  async migrateFiles(originFolder: Folder, destinationFolder: Folder) {
    await this.getFolderFromServer(originFolder, 'origin');

    const localFilePath = config.downloadsDir + originFolder.name;
    if (!(await fileExists(localFilePath))) {
      throw new Error(`Could not find origin files at ${localFilePath}`);
    }
  }

  getPath(item: File | Folder) {
    if (!item.extension) item.extension = '';
    return item.path + item.name + item.extension;
  }
}
