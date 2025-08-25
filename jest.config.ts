import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

export default {
	...createDefaultEsmPreset({
		tsconfig: 'tsconfig.json',
	}),
} satisfies Config;
