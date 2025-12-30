import { IsInt, IsOptional, IsPositive, IsString, IsDateString } from 'class-validator';

export class CreateSavingDto {
  @IsOptional()
  @IsInt()
  saverId?: number;

  @IsPositive()
  amount!: number;

  @IsString()
  currencyCode!: string;

  @IsDateString()
  savingDate!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsString()
  savingPlace!: string;

  @IsOptional()
  @IsString()
  status?: string;
}
