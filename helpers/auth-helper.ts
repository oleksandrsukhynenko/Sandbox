import { Page } from '@playwright/test';
import { registrationFormData } from '../data/user-registration-form.data';
import { ProfileFormPage } from '../pages/profile-form.page';
import { LoginFormPage } from '../pages/login-form.page';

export async function login(page: Page) {

	const loginForm = new LoginFormPage(page);

	await page.goto('/login');

	await loginForm.userNameInput.fill(registrationFormData.userName);
	await loginForm.passwordInput.fill(registrationFormData.password);

	await loginForm.loginButton.click();
	
}

export async function logout(page: Page) {

	const profileForm = new ProfileFormPage(page);

	await profileForm.logoutButton.click();

}