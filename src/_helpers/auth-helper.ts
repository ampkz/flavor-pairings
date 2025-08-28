import { Auth } from '@ampkz/auth-neo4j/auth';
import { User } from '@ampkz/auth-neo4j/user';

export function isPermitted(authorizedUser: User | undefined, ...rolesPermitted: Auth[]): boolean {
	if (!authorizedUser) return false;
	return rolesPermitted.includes(authorizedUser.auth);
}
