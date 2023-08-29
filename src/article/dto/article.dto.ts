import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateArticleDto {
  @IsInt()
  @Min(1)
  @Max(10000)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  serialNumber: string;
}
