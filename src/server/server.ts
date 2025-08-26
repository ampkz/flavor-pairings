import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { readFileSync } from 'fs';
import path from 'path';
import { resolvers as flavorResolvers } from '../graphql/resolvers/flavorResolvers';
import Config from '../config/config';

export interface MyContext {}

async function startServer() {
	const app = express();
	const httpServer = http.createServer(app);

	const parentPath = path.dirname(__dirname);

	const typeDefs = readFileSync(parentPath + '/graphql/schema/schema.graphql', { encoding: 'utf-8' });

	const server = new ApolloServer<MyContext>({
		typeDefs,
		resolvers: flavorResolvers,
		includeStacktraceInErrorResponses: Config.IS_NOT_PROD,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	await server.start();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use('/graphql', expressMiddleware(server));

	return app;
}

export default startServer;
