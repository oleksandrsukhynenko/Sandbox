import { Page } from "@playwright/test";

export class BookStorePage {
	constructor(private page: Page) {}

	get searchInput() {
		return this.page.getByPlaceholder('Type to search');
	}

	bookTitleLink(title: string) {
		return this.page.getByRole('link', { name: title });
	}

	get bookImage() {
		return this.page.getByRole('img', { name: 'book-image' });
	}

	get addToCollectionButton() {
		return this.page.getByRole('button', { name: 'Add To Your Collection' });
	}
}
