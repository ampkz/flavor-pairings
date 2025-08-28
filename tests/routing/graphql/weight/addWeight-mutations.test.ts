import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudWeight from '../../../../src/db/pairings/crud-weight';
import { faker } from '@faker-js/faker';

describe('AddWeight mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should add a weight to a flavor and return the weight', async () => {
		const flavorName = faker.word.noun();
		const weightName = faker.word.noun();
		jest.spyOn(crudWeight, 'addWeight').mockResolvedValue({ name: weightName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddWeight($input: AddWeightInput!) {
                    addWeight(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: flavorName, weight: weightName } },
			})
			.expect(200);

		expect(response.body.data.addWeight).toEqual({ name: weightName });
	});

	it('should return null if addWeight returns null', async () => {
		const flavorName = faker.word.noun();
		const weightName = faker.word.noun();
		jest.spyOn(crudWeight, 'addWeight').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddWeight($input: AddWeightInput!) {
                    addWeight(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: flavorName, weight: weightName } },
			})
			.expect(200);

		expect(response.body.data.addWeight).toBeNull();
	});
});
