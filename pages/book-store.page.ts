import { Page } from "@playwright/test";
import { BasePage } from './base.page';

export class BookStorePage extends BasePage {
	constructor(page: Page) {
		super(page);
	}

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
