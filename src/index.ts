import Config from './config/config';
import startServer from './server/server';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
	const app = await startServer();
	app.listen(Config.PORT, () => {
		console.log(`[server]: Node environment is: ${process.env.NODE_ENV}`);
		console.log(`[server]: Server is running at http://localhost:${Config.PORT}/`);
		console.log(`[server]: Graphql endpoint at http://localhost:${Config.PORT}/graphql`);
	});
})();
