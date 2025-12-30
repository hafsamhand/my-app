import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { SavingStatus } from '@prisma/client';

export class FilterSavingsDto {
  @IsOptional()
  @IsEnum(SavingStatus)
  status?: SavingStatus;

  @IsOptional()
  @IsString()
  currencyCode?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  savingPlace?: string;
}

