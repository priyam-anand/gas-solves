import { Transform } from 'class-transformer';
import { IsEthereumAddress, IsNotEmpty } from 'class-validator';
import { getAddress } from 'ethers';

export class RefreshDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  @Transform(({ value }) => getAddress(value))
  address: string;
}
