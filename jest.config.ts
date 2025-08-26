import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

export default {
	...createDefaultEsmPreset({
		tsconfig: 'tsconfig.json',
	}),
	globalSetup: './jestGlobalConfigs/globalSetup.ts',
} satisfies Config;
