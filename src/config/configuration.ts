import { registerAs } from '@nestjs/config';

export interface Configuration {
  port: number;
  jwt: {
    secret: string;
    expirationTime: string;
  };
  database: {
    url: string;
    replicaUrl: string;
  };
  redis: {
    url: string;
  };
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  fileUpload: {
    provider: string;
  };
}

export default (): Configuration => ({
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
  },
  database: {
    url: process.env.DATABASE_URL || '',
    replicaUrl: process.env.DATABASE_URL_REPLICA || '',
  },
  redis: {
    url: process.env.REDIS_URL || '',
  },
  mail: {
    host: process.env.MAIL_HOST || '',
    port: parseInt(process.env.MAIL_PORT || '465', 10),
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
  },
  fileUpload: {
    provider: process.env.FILE_UPLOAD_PROVIDER || '',
  },
});
