import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import { faker } from '@faker-js/faker';

describe('Technique Queries', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a created technique', async () => {
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'getTechnique').mockResolvedValue({ name: techniqueName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetTechnique($name: ID!) {
                    technique(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: techniqueName },
			})
			.expect(200);

		expect(response.body.data.technique).toEqual({ name: techniqueName });
	});

	it('should return null if no technique exists', async () => {
		jest.spyOn(crudTechnique, 'getTechnique').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetTechnique($name: ID!) {
                    technique(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'test_technique' },
			})
			.expect(200);

		expect(response.body.data.technique).toBeNull();
	});

	test('GetTechnique should throw an error if technique name is missing', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetTechnique($name: ID!) {
                    technique(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: null },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should return a list of techniques', async () => {
		const techniques = Array.from({ length: 3 }, () => ({ name: faker.word.noun() }));
		jest.spyOn(crudTechnique, 'getTechniques').mockResolvedValue(techniques);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetTechniques {
                    techniques {
                        name
                    }
                }
            `,
			})
			.expect(200);

		expect(response.body.data.techniques).toEqual(techniques);
	});
});
