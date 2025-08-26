import Config from '../src/config/config';

test('dummy test', () => {
	expect(Config.PAIRINGS_DB).toBeDefined();
});
