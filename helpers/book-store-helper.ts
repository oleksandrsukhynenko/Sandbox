import { APIRequestContext } from '@playwright/test';
import { registrationFormData } from '../data/user-registration-form.data';

export async function addBookToCollection(request: APIRequestContext, userId: string, isbn: string): Promise<void> {
	const tokenResponse = await request.post('/Account/v1/GenerateToken', {
		data: {
			userName: registrationFormData.userName,
			password: registrationFormData.password,
		},
	});
	const { token } = await tokenResponse.json();

	await request.post('/BookStore/V1/Books', {
		headers: { Authorization: `Bearer ${token}` },
		data: {
			userId,
			collectionOfIsbns: [{ isbn }],
		},
	});
}
