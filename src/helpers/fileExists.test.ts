import path from 'path';
import { fileExists } from './fileExists';

describe('FileExists', () => {
  it('Should fail for non existing file', async () => {
    expect(await fileExists(__dirname + '/someNonExistentFile.txt')).toEqual(false);
  });

  it('Should find this test file', async () => {
    expect(await fileExists(__dirname + '/fileExists.test.ts')).toEqual(true);
  });
});
