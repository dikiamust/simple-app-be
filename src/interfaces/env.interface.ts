import { Environment } from 'src/enums';

export interface EnvironmentVariables {
  port: number;
  baseUrl: string;
  nodeEnv: Environment;
  sentryDsn?: string;
  databaseUrl: string;

  jwt: {
    secret: string;
    expiresIn: string;
  };
}
