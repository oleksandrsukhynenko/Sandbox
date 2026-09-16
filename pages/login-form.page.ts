import { Page } from "@playwright/test";
import { BasePage } from './base.page';

export class LoginFormPage extends BasePage {
	constructor(page: Page) {
		super(page);
	}

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
