import { Page } from "@playwright/test";

export class LoginFormPage {
	constructor(private page: Page) {}

	get userNameInput() {
		return this.page.getByRole('textbox', { name: 'UserName' });
	}

	get passwordInput() {
		return this.page.getByRole('textbox', { name: 'Password' });
	}

	get loginButton() {
		return this.page.getByRole('button', { name: 'Login' });
	}
}
