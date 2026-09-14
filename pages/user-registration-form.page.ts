import { Page } from "@playwright/test";
import { BasePage } from './base.page';

export class UserRegistrationFormPage extends BasePage {
	constructor(page: Page) {
		super(page);
	}

	get headerPageRegister() {
		return this.page.getByRole('heading', { name: 'Register to Book Store' });
	}

	get firstNameInput() {
		return this.page.getByRole('textbox', { name: 'First Name' });
	}
	get lastNameInput() {
		return this.page.getByRole('textbox', { name: 'Last Name' });
	}

	get userNameInput() {
		return this.page.getByRole('textbox', { name: 'UserName' });
	}

	get passwordInput() {
		return this.page.getByRole('textbox', { name: 'Password' });
	}

	get registerButton() {
		return this.page.getByRole('button', { name: 'Register' });
	}

	get backToLoginButton() {
		return this.page.getByRole('button', { name: 'Back to Login' });
	}
}