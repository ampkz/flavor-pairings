import { faker } from '@faker-js/faker';

const nountIterator = {
	data: faker.helpers.uniqueArray(() => faker.word.noun(), 200),
	currentIndex: 0,
	next() {
		if (this.currentIndex < this.data.length) {
			return { value: this.currentIndex + this.data[this.currentIndex++], done: false };
		} else {
			return { done: true };
		}
	},
};

(global as any).uniqueNounsIterator = nountIterator;
