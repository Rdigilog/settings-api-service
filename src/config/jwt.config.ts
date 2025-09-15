import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { CONFIG_KEYS } from './config.keys';

export const JwtConfig: any = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>(CONFIG_KEYS.JWT_SECRET),
    signOptions: { expiresIn: config.get<string>(CONFIG_KEYS.JWT_EXPIRATION_TIME) },
  }),
});
