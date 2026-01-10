import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDocumentCategoryDto {
  @ApiProperty({ example: 'HR Policies' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateDocumentCategoryDto {
  @ApiProperty({ example: 'Updated HR Policies', required: false })
  @IsString()
  name?: string;
}
