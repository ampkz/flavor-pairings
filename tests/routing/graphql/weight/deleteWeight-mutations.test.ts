import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudWeight from '../../../../src/db/pairings/crud-weight';
import { faker } from '@faker-js/faker';

describe('DeleteWeight mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a weight', async () => {
		const weightName = faker.word.noun();
		jest.spyOn(crudWeight, 'deleteWeight').mockResolvedValue({ name: weightName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteWeight($name: ID!) {
                    deleteWeight(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: weightName },
			})
			.expect(200);

		expect(response.body.data.deleteWeight).toEqual({ name: weightName });
	});

	it('should return null if no weight found', async () => {
		jest.spyOn(crudWeight, 'deleteWeight').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteWeight($name: ID!) {
                    deleteWeight(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'not_found' },
			})
			.expect(200);

		expect(response.body.data.deleteWeight).toBeNull();
	});
});
