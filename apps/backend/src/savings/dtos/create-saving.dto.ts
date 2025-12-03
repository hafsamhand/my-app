import { IsInt, IsPositive, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateSavingDto {
  @IsInt()
  saverId: number;

  @IsPositive()
  amount: number;

  @IsString()
  currencyCode: string;

  @IsDateString()
  savingDate: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsString()
  savingPlace: string;

  @IsOptional()
  @IsString()
  status?: string;
}
