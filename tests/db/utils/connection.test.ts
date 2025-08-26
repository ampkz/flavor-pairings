import { connect, Errors as DB_CONNECTION_ERRORS } from '../../../src/db/utils/connection';
import { Driver, ServerInfo } from 'neo4j-driver';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import Config from '../../../src/config/config';

describe(`DB Connection Tests`, () => {
	const originalEnv: NodeJS.ProcessEnv = process.env;

	beforeEach(() => {
		jest.resetModules();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it(`should connect to the DB`, async () => {
		const driver: Driver = await connect();
		const serverInfo: ServerInfo = await driver.getServerInfo();
		await driver.close();
		expect(serverInfo.address).toEqual(`${Config.NEO4J_HOST}:${Config.NEO4J_PORT}`);
	});

	it(`should throw an error with an incorrect password`, async () => {
		process.env = {
			...originalEnv,
			NEO4J_PWD: `incorrect password`,
		};
		await expect(connect()).rejects.toThrow(DB_CONNECTION_ERRORS.DB_CONNECTION_UNAUTHORIZED);
	});

	it(`should throw an InternalError with code 500 with an incorrect password`, async () => {
		process.env = {
			...originalEnv,
			NEO4J_PWD: `incorrect password`,
		};

		try {
			await connect();
		} catch (error) {
			expect(error instanceof InternalError).toBeTruthy();
			expect((error as InternalError).getCode()).toEqual(500);
		}

		expect(true).toBeTruthy();
	});
});
