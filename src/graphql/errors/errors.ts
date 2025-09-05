import { GraphQLError } from 'graphql';
import { Neo4jError } from 'neo4j-driver';

export enum Errors {
	UNAUTHORIZED = 'UNAUTHORIZED',
}

export function unauthorizedError(message: string): GraphQLError {
	return new GraphQLError(message, { extensions: { code: Errors.UNAUTHORIZED, http: { status: 401 } } });
}

export function internalError(message: string): GraphQLError {
	return new GraphQLError(message, { extensions: { code: 'INTERNAL_SERVER_ERROR', http: { status: 500 } } });
}

export function conflictError(message: string): GraphQLError {
	return new GraphQLError(message, { extensions: { code: 'CONFLICT', http: { status: 409 } } });
}

export function getGraphQLError(whenMessage: string, error: unknown): GraphQLError {
	if (error instanceof Error) {
		if (error.cause instanceof Neo4jError) {
			return neo4jErrorToGraphQLError(whenMessage, error.cause);
		}
		return internalError(`Internal error: ${error.message} when ${whenMessage}`);
	}
	return internalError(`Unknown internal error when ${whenMessage}`);
}

function neo4jErrorToGraphQLError(whenMessage: string, error: Neo4jError): GraphQLError {
	switch (error.code) {
		case 'Neo.ClientError.Schema.ConstraintValidationFailed':
			return conflictError(`A unique constraint was violated when ${whenMessage}`);
		default:
			return internalError(`An unknown Neo4j error occurred when ${whenMessage}`);
	}
}
