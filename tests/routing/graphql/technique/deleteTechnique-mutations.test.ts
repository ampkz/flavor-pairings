import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import { faker } from '@faker-js/faker';

describe('DeleteTechnique mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a technique', async () => {
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'deleteTechnique').mockResolvedValue({ name: techniqueName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteTechnique($name: ID!) {
                    deleteTechnique(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: techniqueName },
			})
			.expect(200);

		expect(response.body.data.deleteTechnique).toEqual({ name: techniqueName });
	});

	it('should return null if no technique found', async () => {
		jest.spyOn(crudTechnique, 'deleteTechnique').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteTechnique($name: ID!) {
                    deleteTechnique(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'not_found' },
			})
			.expect(200);

		expect(response.body.data.deleteTechnique).toBeNull();
	});
});
