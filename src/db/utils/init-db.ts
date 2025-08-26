import { connect } from './connection';
import { Driver, Session, RecordShape, Record } from 'neo4j-driver';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import Config from '../../config/config';
import { getSessionOptions } from '../../_helpers/db-helper';

export enum ErrorMsgs {
	COULD_NOT_CREATE_DB = 'Could Not Create Database',
	COULD_NOT_CREATE_CONSTRAINT = 'Could Not Create Constraint',
	CONSTRAINT_ALREADY_EXISTS = 'Constrain Already Exists',
}

export async function initializeDB(): Promise<boolean> {
	const driver: Driver = await connect();
	let session = driver.session();
	const match = await session.run(`CREATE DATABASE ${getSessionOptions(Config.PAIRINGS_DB).database} IF NOT EXISTS WAIT`);

	if ((match.records[0] as Record).get(`address`) != `${Config.NEO4J_HOST}:${Config.NEO4J_PORT}`) {
		await session.close();
		await driver.close();
		throw new InternalError(ErrorMsgs.COULD_NOT_CREATE_DB);
	}

	await session.close();

	session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	await initializeConstraint(session, 'Flavor', 'name');

	await driver.close();

	return true;
}

async function initializeConstraint(session: Session, identifier: string, property: string, isRelationship: boolean = false): Promise<boolean> {
	const constraintName: string = `${identifier.toLowerCase()}_${property.toLowerCase()}`;
	let query: string;

	if (isRelationship) {
		query = `CREATE CONSTRAINT ${constraintName} IF NOT EXISTS FOR ()-[r:${identifier}]-() REQUIRE r.${property} IS RELATIONSHIP KEY`;
	} else {
		query = `CREATE CONSTRAINT ${constraintName} IF NOT EXISTS FOR (n:${identifier}) REQUIRE n.${property} IS NODE KEY`;
	}

	const match: RecordShape = await session.run(query);

	if (match.summary.counters._stats.constraintsAdded !== 1) {
		throw new InternalError(ErrorMsgs.COULD_NOT_CREATE_CONSTRAINT, {
			cause: { issue: ErrorMsgs.CONSTRAINT_ALREADY_EXISTS, constraintName },
		});
	}
	return true;
}

export async function verifyDB(dbName: string): Promise<boolean> {
	const driver: Driver = await connect();
	const session: Session = driver.session();
	const match: RecordShape = await session.run(`SHOW DATABASE ${dbName}`);
	await session.close();
	await driver.close();
	return match.records.length === 1;
}

export async function destroyDB(): Promise<void> {
	const driver: Driver = await connect();
	const session: Session = driver.session();
	await session.run(`DROP DATABASE ${getSessionOptions(Config.PAIRINGS_DB).database} IF EXISTS DESTROY DATA WAIT`);
	await session.close();
	await driver.close();
}
