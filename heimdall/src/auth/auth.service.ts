import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CHALLENGE_PREFIX, NONCE_SUB } from './auth.constants';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginData } from './interface/login.interface';
import { verifyMessage } from 'ethers';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as crypto from 'crypto';
import { UserRepoService } from '../repo/user-repo.service';
import { AuthException } from './errors/auth.error';
@Injectable()
export class AuthService {
  private nonceSecret: string;
  private nonceExpiresIn: string;
  private accessTokenSecret: string;
  private accessTokenExpiresIn: string;
  private refreshTokenSecret: string;
  private refreshTokenExpiresIn: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepoSerivce: UserRepoService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const nonceDetails = this.configService.get('NONCE');
    const accessTokenDetails = this.configService.get('ACCESS_TOKEN');
    const refreshTokenDetails = this.configService.get('REFRESH_TOKEN');
    this.accessTokenSecret = accessTokenDetails.SECRET;
    this.accessTokenExpiresIn = accessTokenDetails.EXPIRES_IN;
    this.refreshTokenSecret = refreshTokenDetails.SECRET;
    this.refreshTokenExpiresIn = refreshTokenDetails.EXPIRES_IN;
    this.nonceSecret = nonceDetails.SECRET;
    this.nonceExpiresIn = nonceDetails.EXPIRES_IN;
  }

  generateChallenge(): { data: string } {
    const nonce = this.generateNonce();
    this.logger.info(`Creating new challenge string [Nonce : ${nonce}]`);
    return { data: CHALLENGE_PREFIX + nonce };
  }

  async login(address: string) {
    try {
      this.logger.info(`Loggin in [address : ${address}]`);

      const tokens = this.getAccountTokens(address);
      await this.userRepoSerivce.findOrCreate(address);

      const tokenHash = this.hashToken(tokens.refresh_token);

      await this.userRepoSerivce.updateUser(address, {
        refreshTokenHash: tokenHash,
      });

      return { data: tokens };
    } catch (error) {
      this.logger.error(
        `Error in logging in [address : ${address}] : ${error.stack}`,
      );
      throw new AuthException(`Could not login user: ${error}`);
    }
  }

  async refreshToken(address: string, refreshToken: string) {
    try {
      this.logger.info(`Creating new refresh token [address : ${address}]`);

      // check if previous refresh token matches the stored one
      const tokenHash = this.hashToken(refreshToken);
      const user = await this.userRepoSerivce.findOrCreate(address);

      if (user.refreshTokenHash !== tokenHash) {
        this.logger.error(`Invalid refresh token [address : ${address}]`);
        throw new AuthException(
          'Could not validate refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // create new tokens and save refresh token to db
      const newTokens = this.getAccountTokens(address);
      const newTokenHash = this.hashToken(newTokens.refresh_token);
      await this.userRepoSerivce.updateUser(address, {
        refreshTokenHash: newTokenHash,
      });

      return { data: newTokens };
    } catch (error) {
      this.logger.error(
        `Error in creating new refresh token [address : ${address}]`,
      );
      throw new AuthException(`Could not create new tokens: ${error}`);
    }
  }

  validateLoginData(loginData: LoginData) {
    try {
      const { address, challenge, signature } = loginData;
      const isPrefixValid = challenge.startsWith(CHALLENGE_PREFIX);
      this.logger.info(
        `Verifying signed challenge string [address : ${address}, challenge : ${challenge}, signature : ${signature}]`,
      );
      if (!isPrefixValid) {
        this.logger.info(
          `Challenge prefix does not match [requiredPrefix : ${CHALLENGE_PREFIX}]`,
        );
        return false;
      }

      const nonce = challenge.substring(CHALLENGE_PREFIX.length);
      const isNonceValid = this.verifyNonce(nonce);

      if (!isNonceValid) {
        this.logger.info(`Invalid nonce used [Nonce : ${nonce}]`);
        return false;
      }
      const isSignatureValid = this.verifySignature(
        challenge,
        address,
        signature,
      );

      if (!isSignatureValid) {
        this.logger.info(
          `Invalid sign in signature [Signature : ${signature}]`,
        );
        return false;
      }
      this.logger.info(`Signin signature validated`);
      return true;
    } catch (error) {
      const { address, challenge, signature } = loginData;
      this.logger.error(
        `Error in verifying signed challenge string  : ${address}, challenge : ${challenge}, signature : ${signature}] : ${error.stack}`,
      );
      return false;
    }
  }

  verifySignature(challenge: string, address: string, signatureHex: string) {
    try {
      const extractedAddress = verifyMessage(challenge, signatureHex);
      return extractedAddress === address;
    } catch (error) {
      return false;
    }
  }

  getAccountTokens(address: string) {
    const payload = { address: address };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.accessTokenExpiresIn,
        secret: this.accessTokenSecret,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.refreshTokenExpiresIn,
        secret: this.refreshTokenSecret,
      }),
    };
  }

  hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  verifyNonce(nonce: string) {
    const payload = this.jwtService.verify(nonce, {
      secret: this.nonceSecret,
      ignoreExpiration: false,
    });

    return payload.nonceSub === NONCE_SUB;
  }

  generateNonce(): string {
    return this.jwtService.sign(
      { nonceSub: NONCE_SUB },
      { expiresIn: this.nonceExpiresIn, secret: this.nonceSecret },
    );
  }
}
