export type Config = {
  databaseUrl: string;
  latexCompilerServerUrl: string;
  postgresUser: string;
  postgresPassword: string;
  postgresDb: string;
};

export function readConfig(): Config {
  const databaseUrl = getEnv('DATABASE_URL');
  const latexCompilerServerUrl = getEnv('LATEX_COMPILER_SERVER_URL');
  const postgresUser = getEnv('POSTGRES_USER');
  const postgresPassword = getEnv('POSTGRES_PASSWORD');
  const postgresDb = getEnv('POSTGRES_DB');

  return {
    databaseUrl,
    latexCompilerServerUrl,
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
