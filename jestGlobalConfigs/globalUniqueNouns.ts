import { faker } from '@faker-js/faker';

const nountIterator = {
	data: faker.helpers.uniqueArray(() => faker.word.noun(), 200),
	currentIndex: 0,
	next() {
		if (this.currentIndex < this.data.length) {
			return { value: this.data[this.currentIndex++], done: false };
		} else {
			return { done: true };
		}
	},
};

const getNextNoun = (prefix: string = '') => {
	const next = nountIterator.next();
	return next.done ? null : `${prefix}${next.value}`;
};

(global as any).getNextNoun = getNextNoun;
