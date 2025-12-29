/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsPositive, IsString, IsDateString } from 'class-validator';

export class CreateLoanDto {
  @IsInt()
  loanerId!: number;
  @IsInt()
  borrowerId!: number;

  @IsPositive()
  amount!: number;
  @IsString()
  currencyCode!: string;

  @IsDateString()
  borrowingDate!: Date;

  @IsDateString()
  dueDate!: Date;

  @IsOptional()
  @IsInt()
  prolongementDuration?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
