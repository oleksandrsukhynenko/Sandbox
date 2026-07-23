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

}