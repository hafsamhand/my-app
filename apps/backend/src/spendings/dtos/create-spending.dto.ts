import { IsInt, IsPositive, IsString, IsDateString } from 'class-validator';

export class CreateSpendingDto {
  @IsInt()
  spenderId: number;

  @IsPositive()
  amount: number;

  @IsString()
  currencyCode: string;

  @IsDateString()
  spendingDate: string;

  @IsString()
  spentOn: string;
}
