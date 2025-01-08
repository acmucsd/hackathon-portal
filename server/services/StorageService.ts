import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Service } from 'typedi';
import * as multer from 'multer';
import * as path from 'path';
import { FileOptions, MediaTypeConfig } from '../types/Internal';
import { Config } from '../config';
import { File } from '../types/ApiRequests';
import { InternalServerError } from 'routing-controllers';
import { MediaType } from '../types/Enums';
import { Upload } from '@aws-sdk/lib-storage';

@Service()
export class StorageService {
  private s3 = new S3Client({
    region: Config.s3.region,
    credentials: Config.s3.credentials,
  });

  public async upload(
    file: File,
    mediaType: MediaType,
    fileName: string,
  ): Promise<string> {
    const { uploadPath } = StorageService.getMediaConfig(mediaType);
    const fileExtension = path.extname(file.originalname);
    const fullPath = `${uploadPath}/${fileName}${fileExtension}`;

    const upload = new Upload({
      client: this.s3,
      params: {
        ACL: 'public-read',
        Bucket: Config.s3.bucket,
        Key: fullPath,
        Body: file.buffer,
      },
    });
    const response = await upload.done();
    if (!response.Location)
      throw new InternalServerError('Resource could not be uploaded');
    console.log(fullPath, response.Location);
    return response.Location;
  }

  public async deleteAtUrl(url: string): Promise<void> {
    const { pathname } = new URL(url);
    const delimiter = pathname.indexOf('/', 1);
    const bucket = pathname.slice(1, delimiter);
    const key = pathname.slice(delimiter);
    console.log(url, pathname, bucket, key);
    await this.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  }

  public static getFileOptions(mediaType: MediaType): FileOptions {
    const mediaConfig = StorageService.getMediaConfig(mediaType);
    return {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: mediaConfig.maxFileSize,
      },
    };
  }

  private static getMediaConfig(type: MediaType): MediaTypeConfig {
    switch (type) {
      case MediaType.RESUME: {
        return {
          type: MediaType.RESUME,
          maxFileSize: Config.file.MAX_RESUME_FILE_SIZE,
          uploadPath: Config.file.RESUME_UPLOAD_PATH,
        };
      }
      default: {
        throw new InternalServerError('Invalid media type for file');
      }
    }
  }
}
