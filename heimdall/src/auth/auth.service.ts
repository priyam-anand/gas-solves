import { Inject, Injectable } from '@nestjs/common';
import { CHALLENGE_PREFIX, NONCE_SUB } from './auth.constants';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginData } from './interface/login.interface';
import { verifyMessage } from 'ethers';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  private nonceSecret: string;
  private nonceExpiresIn: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const nonceDetails = this.configService.get('NONCE');
    this.nonceSecret = nonceDetails.SECRET;
    this.nonceExpiresIn = nonceDetails.EXPIRES_IN;
  }

  generateChallenge(): string {
    const nonce = this.generateNonce();
    this.logger.info(`Creating new challenge string [Nonce : ${nonce}]`);
    return CHALLENGE_PREFIX + nonce;
  }

  async login(address: string) {}

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
      this.logger.info(`Sign in signature validated`);
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

  // NONCE FUNCTIONS

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
