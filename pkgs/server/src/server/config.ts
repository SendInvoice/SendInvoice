export type Config = {
  databaseUrl: string;
  postgresUser: string;
  postgresPassword: string;
  postgresDb: string;
};

export function readConfig(): Config {
  const databaseUrl = getEnv('DATABASE_URL');
  const postgresUser = getEnv('POSTGRES_USER');
  const postgresPassword = getEnv('POSTGRES_PASSWORD');
  const postgresDb = getEnv('POSTGRES_DB');

  return {
    databaseUrl,
    postgresUser,
    postgresPassword,
    postgresDb
  };
}

const getEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};
