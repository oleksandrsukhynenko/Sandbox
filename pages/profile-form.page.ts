import { Page } from "@playwright/test";

export class ProfileFormPage {
	constructor(private page: Page) {}

	get registrationLink() {
	    return this.page.getByRole('link', { name: 'register' });
	}

	get loginLink() {
		return this.page.getByRole('link', { name: 'login' });
	}

	get logoutButton() {
	    return this.page.getByRole('button', { name: 'Logout' });
	}

	get deleteAccountButton() {
		return this.page.getByRole('button', { name: 'Delete Account' });
	}

	get okButton() {
		return this.page.getByRole('button', { name: 'OK' });
	}

	bookTitleInCollection(title: string) {
		return this.page.getByRole('link', { name: title });
	}

	bookIsbnInCollection(isbn: string) {
		return this.page.getByRole('cell', { name: isbn });
	}

	bookAuthorInCollection(author: string) {
		return this.page.getByRole('cell', { name: author });
	}

	bookPublisherInCollection(publisher: string) {
		return this.page.getByRole('cell', { name: publisher });
	}

	get bookImage() {
		return this.page.getByRole('img', { name: 'book-image' });
	}

}