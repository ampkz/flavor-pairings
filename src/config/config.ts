export default class Config {
	static PAIRINGS_DB = process.env.PAIRINGS_DB as string;
	/* istanbul ignore next line */
	static PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
	/* istanbul ignore next line */
	static IS_NOT_PROD: boolean = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
}
