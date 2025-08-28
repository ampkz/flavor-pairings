import { GraphQLError } from 'graphql';

export enum Errors {
	UNAUTHORIZED = 'UNAUTHORIZED',
}

export function unauthorizedError(message: string): GraphQLError {
	return new GraphQLError(message, { extensions: { code: Errors.UNAUTHORIZED } });
}
