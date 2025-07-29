import 'reflect-metadata';
import { configDotenv } from 'dotenv';

import { makeServer } from './server';

async function main(): Promise<void> {
  try {
    configDotenv();

    const server = await makeServer();

    await server.listen({
      port: 8080,
      listenTextResolver: (addr) => {
        return `"Send Invoice Server" Listening at ${addr}`;
      }
    });
  } catch (err) {
    console.error('Failed to initialize "Send Invoice Server"', err);
    process.exit(1);
  }
}

main();
