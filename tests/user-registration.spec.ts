import { test, expect } from '@playwright/test';
import { UserRegistrationFormPage } from '../pages/user-registration-form.page';
import { ProfileFormPage } from '../pages/profile-form.page';
import { registrationFormData } from '../data/user-registration-form.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';
import { login, logout } from '../helpers/ui-helper';
import { deleteUser } from '../helpers/api-helper';
import { LoginFormPage } from '../pages/login-form.page';

test.describe('User account flow', () => {
	let userId: string;
	let userRegistrationForm: UserRegistrationFormPage;
	let profileForm: ProfileFormPage;
	let mainNavigationMenu: MainNavigationMenu;
	let loginForm: LoginFormPage;

	test.beforeEach(async ({ page }) => {
		userRegistrationForm = new UserRegistrationFormPage(page);
		profileForm = new ProfileFormPage(page);
		mainNavigationMenu = new MainNavigationMenu(page);
		loginForm = new LoginFormPage(page);

		await test.step('Open registration form', async () => {
			await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Profile);
			await profileForm.registrationLink.click();
			await userRegistrationForm.expectLocatorToBeVisible(userRegistrationForm.headerPageRegister, true);
		});
	});

	test('User registration and login/logout', { tag: '@smoke' }, async ({ page }) => {
		await test.step('Fill registration data', async () => {
			await page.waitForLoadState('networkidle');

			await userRegistrationForm.firstNameInput.fill(registrationFormData.firstName);
			await userRegistrationForm.lastNameInput.fill(registrationFormData.lastName);
			await userRegistrationForm.userNameInput.fill(registrationFormData.userName);
			await userRegistrationForm.passwordInput.fill(registrationFormData.password);
		});

		await test.step('Register and capture created user id', async () => {
			page.on('response', async (response) => {
				if (response.url().includes('/Account/v1/User') && response.request().method() === 'POST') {
					const body = await response.json().catch(() => null);
					if (body?.userID) {
						userId = body.userID;
					}
				}
			});

			page.once('dialog', async dialog => {
				expect(dialog.message()).toBe('User Registered Successfully.');
				await dialog.accept();
			});

			await userRegistrationForm.registerButton.click();
			await userRegistrationForm.backToLoginButton.click();
		});

		await test.step('Login and logout with new user', async () => {
			await login(page);
			await profileForm.expectLocatorToBeVisible(profileForm.logoutButton, true);

			await logout(page);
			await loginForm.expectLocatorToBeVisible(loginForm.loginButton, true);
		});

	});

	test.afterAll(async ({ request }) => {
		await deleteUser(request, userId);
	});
});