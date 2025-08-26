import neo4j, { Driver } from 'neo4j-driver';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import Config from '../../config/config';

export enum Errors {
	DB_CONNECTION_UNAUTHORIZED = 'Unauthorized Connection to Driver',
}

export async function connect(): Promise<Driver> {
	const driver: Driver = neo4j.driver(
		`bolt://${Config.NEO4J_HOST}:${Config.NEO4J_PORT}`,
		neo4j.auth.basic(Config.NEO4J_USER, process.env.NEO4J_PWD as string)
	);

	try {
		// Will throw an error if not authenticated
		await driver.getServerInfo();
	} catch (error) {
		throw new InternalError(Errors.DB_CONNECTION_UNAUTHORIZED, { cause: error });
	}

	return driver;
}
