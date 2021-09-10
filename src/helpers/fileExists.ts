import * as fs from 'fs';

export function fileExists(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      return true;
    }
    console.log(`Could not find a file at '${filePath}'`);
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
