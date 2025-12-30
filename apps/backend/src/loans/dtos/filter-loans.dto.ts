import { IsOptional, IsString, IsDateString, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { LoanStatus } from '@prisma/client';

export class FilterLoansDto {
  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;

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
  @Type(() => Number)
  @IsInt()
  loanerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  borrowerId?: number;
}

