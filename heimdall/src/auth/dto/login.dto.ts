import { Transform } from 'class-transformer';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';
import { getAddress } from 'ethers';

export class LoginDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  @Transform(({ value }) => getAddress(value))
  address: string;

  @IsNotEmpty()
  @IsString()
  challenge: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}
