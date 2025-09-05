import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('AddVolume mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should add a volume to a flavor and return the volume', async () => {
		const flavorName = faker.word.noun();
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'addVolume').mockResolvedValue({ name: volumeName });

		const validateSessionTokenSpy = jest.spyOn(sessions, 'validateSessionToken');
		validateSessionTokenSpy.mockResolvedValueOnce({
			session: { id: '', expiresAt: new Date(), userID: '', host: '', userAgent: '' },
			user: new User({ email: faker.internet.email(), auth: Auth.ADMIN }),
		});

		const token = sessions.generateSessionToken();

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddVolume($input: AddVolumeInput!) {
                    addVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: flavorName, volume: volumeName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.addVolume).toEqual({ name: volumeName });
	});

	it('should return null if addVolume returns null', async () => {
		const flavorName = faker.word.noun();
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'addVolume').mockResolvedValue(null);
		const validateSessionTokenSpy = jest.spyOn(sessions, 'validateSessionToken');
		validateSessionTokenSpy.mockResolvedValueOnce({
			session: { id: '', expiresAt: new Date(), userID: '', host: '', userAgent: '' },
			user: new User({ email: faker.internet.email(), auth: Auth.ADMIN }),
		});

		const token = sessions.generateSessionToken();
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddVolume($input: AddVolumeInput!) {
                    addVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: flavorName, volume: volumeName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.addVolume).toBeNull();
	});
});
