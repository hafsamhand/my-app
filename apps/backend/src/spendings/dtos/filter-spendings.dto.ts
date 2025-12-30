import { IsOptional, IsString, IsDateString } from 'class-validator';

export class FilterSpendingsDto {
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
  spentOn?: string;
}

