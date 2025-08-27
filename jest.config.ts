import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

export default {
	...createDefaultEsmPreset({
		tsconfig: 'tsconfig.json',
	}),
	globalSetup: './jestGlobalConfigs/globalSetup.ts',
	globalTeardown: './jestGlobalConfigs/globalTeardown.ts',
	setupFiles: ['./jestGlobalConfigs/globalUniqueNouns.ts'],
} satisfies Config;
