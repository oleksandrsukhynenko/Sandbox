import { test, expect } from '@playwright/test';
import { UserRegistrationFormPage } from '../pages/user-registration-form.page';
import { ProfileFormPage } from '../pages/profile-form.page';
import { registrationFormData } from '../data/user-registration-form.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';
import { login, logout, deleteUser } from '../helpers/auth-helper';
import { LoginFormPage } from '../pages/login-form.page';

const data = registrationFormData;
let userId: string;

test.describe('User account flow', () => {
	test('User registration and login@logout', async ({ page }) => {
		const userRegistrationForm = new UserRegistrationFormPage(page);
		const profileForm = new ProfileFormPage(page);
		const mainNavigationMenu = new MainNavigationMenu(page);
		const loginForm = new LoginFormPage(page);

		await test.step('Open registration form', async () => {
			await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Profile);
			await profileForm.registrationLink.click();
			await userRegistrationForm.isLocatorVisible(userRegistrationForm.headerPageRegister, true);
		});

		await test.step('Fill registration data', async () => {
			// Fill the registration form with valid data
	  		await page.waitForLoadState('networkidle');

			await userRegistrationForm.firstNameInput.fill(data.firstName);
			await userRegistrationForm.lastNameInput.fill(data.lastName);
			await userRegistrationForm.userNameInput.fill(data.userName);
			await userRegistrationForm.passwordInput.fill(data.password);
		});

		await test.step('Register and capture created user id', async () => {
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
		});

		await test.step('Login and logout with new user', async () => {
			await login(page);
			await profileForm.isLocatorVisible(profileForm.logoutButton, true);

			await logout(page);
			await loginForm.isLocatorVisible(loginForm.loginButton, true);
		});

	});

	test.afterAll(async ({ request }) => {
		await deleteUser(request, userId);
	});
});