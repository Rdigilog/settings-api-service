/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileUploadService } from 'src/utils/services/file-upload.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('file')
export class FileController {
  constructor(
    private readonly responseService: ResponsesService,
    // private readonly utilsService: UtilsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.fileUploadService.uploadPicture(file);
      // const url = await this.cloudinaryUpload(file);
      return this.responseService.success(result);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Files to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadFiles(@UploadedFiles() files?: { files?: any[] }) {
    try {
      if (files?.files) {
        const filesData = await Promise.all(
          files?.files.map(async (file) => {
            console.log(file);
            const result = await this.fileUploadService.uploadPicture(file);
            return result;
          }),
        );
        return this.responseService.success(filesData);
      } else {
        return this.responseService.badRequest(
          'You need upload at least one file',
        );
      }
    } catch (e) {
      console.log(e.message);
      return this.responseService.exception(e.message);
    }
  }
}
