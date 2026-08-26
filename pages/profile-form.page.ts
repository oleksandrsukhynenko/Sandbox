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
		return this.page.getByRole('button', { name: 'OK', exact: true });
	}

	get cancelButton() {
		return this.page.getByRole('button', { name: 'Cancel' });
	}

	get deleteBookModalTitle() {
		return this.page.locator('#example-modal-sizes-title-sm');
	}

	get deleteBookModalBody() {
		return this.page.locator('.modal-body');
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

	deleteBookButton(isbn: string) {
		return this.page.locator(`#delete-record-${isbn}`);
	}

}