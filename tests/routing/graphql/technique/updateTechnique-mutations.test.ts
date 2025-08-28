import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import { faker } from '@faker-js/faker';

describe('UpdateTechnique mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should update a technique', async () => {
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'updateTechnique').mockResolvedValue({ name: 'updated_' + techniqueName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateTechnique($input: UpdateTechniqueInput!) {
                    updateTechnique(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: techniqueName, updatedName: 'updated_' + techniqueName } },
			})
			.expect(200);

		expect(response.body.data.updateTechnique).toEqual({ name: 'updated_' + techniqueName });
	});

	it('should return null if no technique was found to update', async () => {
		jest.spyOn(crudTechnique, 'updateTechnique').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateTechnique($input: UpdateTechniqueInput!) {
                    updateTechnique(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: 'not_found', updatedName: 'updated_name' } },
			})
			.expect(200);

		expect(response.body.data.updateTechnique).toBeNull();
	});
});
