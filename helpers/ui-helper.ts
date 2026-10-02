import { Page } from '@playwright/test';
import { registrationFormData } from '../data/user-registration-form.data';
import { ProfileFormPage } from '../pages/profile-form/profile-form.page';
import { LoginFormPage } from '../pages/login-form/login-form.page';

/**
 * Logs in through the login form.
 * @param page - the page to perform the login on
 * @param userName - the user name to log in with, defaults to the shared test user
 * @param password - the password to log in with, defaults to the shared test user
 */
export async function login(
	page: Page,
	userName: string = registrationFormData.userName,
	password: string = registrationFormData.password
) {
	const loginForm = new LoginFormPage(page);

	await page.goto('/login');

	await loginForm.userNameInput.fill(userName);
	await loginForm.passwordInput.fill(password);

	await loginForm.loginButton.click();
}

/**
 * Logs out from the profile page.
 * @param page - the page with an authenticated session
 */
export async function logout(page: Page) {
	const profileForm = new ProfileFormPage(page);

	await profileForm.logoutButton.click();
}
