import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export default class Config {
	static NEO4J_HOST: string = process.env.NEO4J_HOST as string;
	static NEO4J_PORT: string = process.env.NEO4J_PORT as string;
	static NEO4J_USER: string = process.env.NEO4J_USER as string;
	static PAIRINGS_DB: string = process.env.PAIRINGS_DB as string;
	/* istanbul ignore next line */
	static PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;

	/* istanbul ignore next line */
	static CLIENT_PORT: number = process.env.CLIENT_PORT ? parseInt(process.env.CLIENT_PORT) : 3000;

	/* istanbul ignore next line */
	static IS_NOT_PROD: boolean = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
}
