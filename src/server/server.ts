import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { read, readFileSync } from 'fs';
import path from 'path';
import { resolvers as flavorResolvers } from '../graphql/resolvers/flavorResolvers';
import { resolvers as tasteResolvers } from '../graphql/resolvers/tasteResolvers';
import { resolvers as volumeResolvers } from '../graphql/resolvers/volumeResolvers';
import { resolvers as weightResolvers } from '../graphql/resolvers/weightResolvers';
import Config from '../config/config';

export interface MyContext {}

async function startServer() {
	const app = express();
	const httpServer = http.createServer(app);

	const parentPath = path.dirname(__dirname);

	let typeDefs = readFileSync(parentPath + '/graphql/schema/schema.graphql', { encoding: 'utf-8' });
	typeDefs += readFileSync(parentPath + '/graphql/schema/flavor-schema.graphql', { encoding: 'utf-8' });
	typeDefs += readFileSync(parentPath + '/graphql/schema/taste-schema.graphql', { encoding: 'utf-8' });
	typeDefs += readFileSync(parentPath + '/graphql/schema/volume-schema.graphql', { encoding: 'utf-8' });
	typeDefs += readFileSync(parentPath + '/graphql/schema/weight-schema.graphql', { encoding: 'utf-8' });

	const server = new ApolloServer<MyContext>({
		typeDefs,
		resolvers: [flavorResolvers, tasteResolvers, volumeResolvers, weightResolvers],
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
