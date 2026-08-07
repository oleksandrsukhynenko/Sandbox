import { test, expect } from '@playwright/test';
import { UserRegistrationFormPage } from '../pages/user-registration-form.page';
import { ProfileFormPage } from '../pages/profile-form.page';
import { registrationFormData } from '../data/user-registration-form.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';
import { login, logout } from '../helpers/auth-helper';
import { LoginFormPage } from '../pages/login-form.page';

const data = registrationFormData;
let userId: string;

test('User registration and login@logout', async ({ page }) => {
	const userRegistrationForm = new UserRegistrationFormPage(page);
	const profileForm = new ProfileFormPage(page);
	const mainNavigationMenu = new MainNavigationMenu(page);
	const loginForm = new LoginFormPage(page);

	await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Profile);
	await profileForm.registrationLink.click();
	await expect(userRegistrationForm.headerPageRegister).toBeVisible();

	// Will be redesigned in future. used to wait full page loading and re-rendering of the form.
	await page.waitForTimeout(2000);

	await userRegistrationForm.firstNameInput.fill(data.firstName);
	await userRegistrationForm.lastNameInput.fill(data.lastName);
	await userRegistrationForm.userNameInput.fill(data.userName);
	await userRegistrationForm.passwordInput.fill(data.password);

	// Intercept the response to get the userId after registration
	page.on('response', async (response) => {
		if (response.url().includes('/Account/v1/User') && response.request().method() === 'POST') {
			const body = await response.json().catch(() => null);
			if (body?.userID) {
				userId = body.userID;
			}
		}
	});

	// Handle the alert dialog that appears after successful registration
	page.once('dialog', async dialog => {
	expect(dialog.message()).toBe('User Registered Successfully.');
	await dialog.accept();
	});

	await userRegistrationForm.registerButton.click();
	await userRegistrationForm.backToLoginButton.click();

	// Assertions are inside the methods, will be moved out of method in future
	await login(page);
	await expect(profileForm.logoutButton).toBeVisible();

	await logout(page);
	await expect(loginForm.loginButton).toBeVisible();

});

test.afterAll(async ({ request }) => {
	const tokenResponse = await request.post('/Account/v1/GenerateToken', {
		data: {
			userName: data.userName,
			password: data.password,
		},
	});
	const {token} = await tokenResponse.json();

	await request.delete(`/Account/v1/User/${userId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
});