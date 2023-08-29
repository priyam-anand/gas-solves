import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RepoModule } from '../repo/repo.module';
import { UserRepoService } from '../repo/user-repo.service';
import { createMock } from '@golevelup/ts-jest';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import configuration from '../../config/configuration';
import { CHALLENGE_PREFIX } from './auth.constants';

describe('Testing Auth Servicd', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ load: [configuration] }),
        JwtModule.register({}),
      ],
      providers: [
        AuthService,
        {
          provide: UserRepoService,
          useValue: createMock<RepoModule>(),
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            info: () => {},
            error: () => {},
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('Generate challenge string', () => {
    it('should generate challenge string', async () => {
      const result = authService.generateChallenge();

      expect(result.data.startsWith(CHALLENGE_PREFIX)).toEqual(true);
      expect(
        authService.verifyNonce(result.data.substring(CHALLENGE_PREFIX.length)),
      ).toEqual(true);
    });
  });

  describe('Validate login data', () => {
    it('should not validate user if prefix is invalid', async () => {});

    it('should not validate user if nonce is invalid', async () => {});

    it('should not validate user if signature is invalid', async () => {});

    it('should validate user', async () => {});
  });

  // describe('Login', () => {
  //   it('should login ', async () => {
  //     const result = await authService.login('abc');
  //     console.log(result);
  //   });
  // });
});
