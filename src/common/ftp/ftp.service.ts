import { Injectable, Logger } from '@nestjs/common';
import { envsFtp } from 'src/config';
import * as ftp from 'basic-ftp';
import { Readable, Writable } from 'stream';

@Injectable()
export class FtpService {
  private readonly logger = new Logger('FtpService');
  // private client: ftp.Client;

  // constructor() {
  //   this.client = new ftp.Client();
  // }

  async connectToFtp(): Promise<ftp.Client> {
    try {
      const client = new ftp.Client();
      await client.access({
        host: envsFtp.ftpHost,
        user: envsFtp.ftpUsername,
        password: envsFtp.ftpPassword,
        secure: envsFtp.ftpSsl,
      });
      this.logger.log('Connected to FTP server successfully');
      return client;
    } catch (error) {
      this.logger.error('Failed to connect to FTP server:', error);
      throw new Error('Failed to connect to FTP server');
    }
  }

  async uploadFile(document: Buffer, initialPath: string, path: string) {
    const client = await this.connectToFtp();
    try {
      const verifyPath = `${envsFtp.ftpRoot}${initialPath}`;
      const remotePath = `${envsFtp.ftpRoot}${path}`;

      const buffer = Buffer.from(document.buffer);
      const documentStream = Readable.from(buffer);
      await client.ensureDir(verifyPath);
      await client.uploadFrom(documentStream, remotePath);
      this.logger.log('Uploaded file successfully');
    } catch (error) {
      this.logger.error('Failed to upload file:', error);
      throw new Error('Failed to upload file');
    } finally {
      this.onDestroy(client);
    }
  }

  async downloadFile(path: string) {
    const client = await this.connectToFtp();
    try {
      const remoteFilePath = `${envsFtp.ftpRoot}${path}`;
      const chunks: Buffer[] = [];
      const writableStream = new Writable({
        write(chunk, encoding, callback) {
          chunks.push(Buffer.from(chunk));
          callback();
        },
      });
      await client.downloadTo(writableStream, remoteFilePath);
      this.logger.log('Downloaded file successfully');
      return Buffer.concat(chunks);
    } catch (error) {
      this.logger.error('Failed to download file:', error);
      throw new Error('Failed to download file:');
    } finally {
      this.onDestroy(client);
    }
  }

  async listFiles(path: string) {
    const client = await this.connectToFtp();
    try {
      const remotePath = `${envsFtp.ftpRoot}${path}`;
      const files = await client.list(remotePath);
      return files;
    } catch (error) {
      this.logger.error('Failed to list files:', error);
      throw new Error('Failed to list files');
    } finally {
      this.onDestroy(client);
    }
  }

  async onDestroy(client: ftp.Client) {
    client.close();
    this.logger.log('FTP connection closed');
  }
}
