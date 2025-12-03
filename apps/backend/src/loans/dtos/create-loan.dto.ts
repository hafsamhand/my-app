import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsDateString } from 'class-validator';

export class CreateLoanDto {
  @IsInt()
  loanerId: number;

  @IsInt()
  borrowerId: number;

  @IsPositive()
  amount: number;

  @IsString()
  currencyCode: string;

  @IsDateString()
  borrowingDate: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsInt()
  prolongementDuration?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
