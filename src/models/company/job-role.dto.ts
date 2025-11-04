import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateJobRoleDto {
  @ApiProperty({ type: String, example: 'Urgent' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: '#FF0000' })
  @IsString()
  color: string;
}

export class AssignJobRoleDto {
  @ApiProperty({
    description: 'Array of user IDs to assign the job role to',
    type: [String],
    example: [
      'd4d30e9a-1a2b-4a39-9ad8-5e1e42d44d12',
      'bd4b9e7e-3e2a-4a2b-8c1b-7b9e8a6f34a1',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}

