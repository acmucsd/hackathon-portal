import * as multer from 'multer';
import { MediaType } from './Enums';

export type FileOptions = multer.Options;

export interface MediaTypeConfig {
  type: MediaType;
  maxFileSize: number;
  uploadPath: string;
}
