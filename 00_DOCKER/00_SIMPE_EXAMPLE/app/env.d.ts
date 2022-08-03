
  // types for your environmental variables
  declare namespace NodeJS {
    export interface ProcessEnv {
      DB_USER : string;
			DB_PASSWORD : string;
			DB_HOST : string;
			DB_PORT : string;

    }
  }
  