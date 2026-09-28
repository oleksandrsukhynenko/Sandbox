import { BasePage } from './base.page';

export class LoginFormLocators extends BasePage {
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
