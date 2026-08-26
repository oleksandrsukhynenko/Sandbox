import { Page, APIRequestContext } from '@playwright/test';
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

export async function createUser(request: APIRequestContext): Promise<string> {
	const response = await request.post('/Account/v1/User', {
		data: {
			userName: registrationFormData.userName,
			password: registrationFormData.password,
		},
	});
	const { userID } = await response.json();
	return userID;
}

export async function deleteUser(request: APIRequestContext, userId: string): Promise<void> {
	const tokenResponse = await request.post('/Account/v1/GenerateToken', {
		data: {
			userName: registrationFormData.userName,
			password: registrationFormData.password,
		},
	});
	const { token } = await tokenResponse.json();

	await request.delete(`/Account/v1/User/${userId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
}