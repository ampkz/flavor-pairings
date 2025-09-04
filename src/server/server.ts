import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { readFileSync } from 'fs';
import path from 'path';
import { resolvers as flavorResolvers } from '../graphql/resolvers/flavorResolvers';
import { resolvers as tasteResolvers } from '../graphql/resolvers/tasteResolvers';
import { resolvers as volumeResolvers } from '../graphql/resolvers/volumeResolvers';
import { resolvers as weightResolvers } from '../graphql/resolvers/weightResolvers';
import { resolvers as techniqueResolvers } from '../graphql/resolvers/techniqueResolvers';
import Config from '../config/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authNeo4j from '@ampkz/auth-neo4j';
import { User } from '@ampkz/auth-neo4j/user';
import { validateSessionToken } from '@ampkz/auth-neo4j/token';
import cors from 'cors';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { error404, errorHandler } from '../middleware/errors';
import cookieParser from 'cookie-parser';

export interface MyContext {
	authorizedUser?: User;
}

async function startServer() {
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per windowMs
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
		message: 'Too many requests from this IP, please try again later.',
	});

	const app = express();
	const httpServer = http.createServer(app);

	const parentPath = path.dirname(__dirname);

	let typeDefs = readFileSync(parentPath + '/graphql/schema/schema.graphql', { encoding: 'utf-8' });
	typeDefs += readFileSync(parentPath + '/graphql/schema/flavor-schema.graphql', { encoding: 'utf-8' });
	typeDefs += readFileSync(parentPath + '/graphql/schema/taste-schema.graphql', { encoding: 'utf-8' });
	typeDefs += readFileSync(parentPath + '/graphql/schema/volume-schema.graphql', { encoding: 'utf-8' });
	typeDefs += readFileSync(parentPath + '/graphql/schema/weight-schema.graphql', { encoding: 'utf-8' });
	typeDefs += readFileSync(parentPath + '/graphql/schema/technique-schema.graphql', { encoding: 'utf-8' });

	const server = new ApolloServer<MyContext>({
		typeDefs,
		resolvers: [flavorResolvers, tasteResolvers, volumeResolvers, weightResolvers, techniqueResolvers],
		includeStacktraceInErrorResponses: Config.IS_NOT_PROD,
		introspection: Config.IS_NOT_PROD,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	await server.start();

	/* istanbul ignore next line */
	const helmetOptions = Config.IS_NOT_PROD
		? {
				crossOriginEmbedderPolicy: false,
				contentSecurityPolicy: {
					directives: {
						imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
						scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
						manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
						frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
					},
				},
		  }
		: {};

	app.use(helmet(helmetOptions));

	/* istanbul ignore next line */
	app.use(
		cors<cors.CorsRequest>({
			origin: `${Config.IS_NOT_PROD ? [`http://localhost:${Config.CLIENT_PORT}`] : ``}`,
			methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
			credentials: true,
		})
	);
	app.use(cookieParser());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(limiter);
	/* istanbul ignore next line */
	app.use(
		'/graphql',
		expressMiddleware(server, {
			context: async ({ req }) => {
				if (Config.IS_NOT_PROD && req.headers.host === `localhost:${Config.PORT}`) {
					return { authorizedUser: new User({ email: 'apollo', auth: Auth.CONTRIBUTOR }) };
				}

				const token = req.cookies.token;
				const svr = await validateSessionToken(token);
				return { authorizedUser: svr.user };
			},
		})
	);

	app.use(authNeo4j());
	app.use(error404);
	app.use(errorHandler);

	return app;
}

export default startServer;
