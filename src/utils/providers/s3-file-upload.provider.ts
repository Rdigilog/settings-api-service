import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { CONFIG_KEYS } from '../../config/config.keys';
import {
  FileUploadProvider,
  UploadedFileDto,
} from '../interfaces/file-upload.interface';

export class S3FileUploadProvider implements FileUploadProvider {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly logger = new Logger(S3FileUploadProvider.name);

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>(CONFIG_KEYS.AWS_S3_REGION);
    const bucket = this.configService.get<string>(CONFIG_KEYS.AWS_S3_BUCKET);
    const accessKeyId =
      this.configService.get<string>(CONFIG_KEYS.AWS_ACCESS_KEY) || '';
    const secretAccessKey =
      this.configService.get<string>(CONFIG_KEYS.AWS_SECRET_ACCESS_KEY) || '';

    if (!region) {
      throw new Error(
        'AWS_S3_REGION environment variable is required for S3 file upload',
      );
    }

    if (!bucket) {
      throw new Error(
        'AWS_S3_BUCKET environment variable is required for S3 file upload',
      );
    }

    // Configure S3Client with credentials if provided (for local testing)
    // On AWS infrastructure (EC2/ECS), IAM roles will be used automatically
    const s3Config: any = { region };
    if (accessKeyId && secretAccessKey) {
      s3Config.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.s3Client = new S3Client(s3Config);
    this.bucket = bucket;
  }

  static uniqueFilename() {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2);
    return `${timestamp}-${randomString}`;
  }

  async upload(file: Express.Multer.File): Promise<UploadedFileDto> {
    try {
      file = this.restoreBuffer(file);
      const fileName = S3FileUploadProvider.uniqueFilename();
      const uploadFolder =
        this.configService.get<string>(CONFIG_KEYS.AWS_S3_UPLOAD_FOLDER) ||
        'uploads';
      const fileExtension = file.originalname.split('.').pop() || '';
      const s3Key = `${uploadFolder}/${fileName}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      // Construct the public URL
      const region = this.configService.get<string>(CONFIG_KEYS.AWS_S3_REGION);
      const url = `https://${this.bucket}.s3.${region}.amazonaws.com/${s3Key}`;

      const uploadedFile: UploadedFileDto = {
        name: file.originalname,
        url,
      };

      return uploadedFile;
    } catch (err) {
      this.logger.error(
        'Error uploading file to S3',
        err instanceof Error ? err.stack : err,
      );
      throw new BadRequestException('Error uploading file to S3.');
    }
  }

  restoreBuffer(file: any) {
    if (file?.buffer?.type === 'Buffer' && Array.isArray(file.buffer.data)) {
      file.buffer = Buffer.from(file.buffer.data);
    }
    return file as Express.Multer.File;
  }

  async remove(url: string) {
    try {
      const key = this.extractKeyFromUrl(url);
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.s3Client.send(command);
    } catch (err) {
      this.logger.error(
        'Error deleting file from S3',
        err instanceof Error ? err.stack : err,
      );
      throw new BadRequestException('Error deleting file from S3.');
    }
  }

  private extractKeyFromUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // remove leading "/"
  }
}
