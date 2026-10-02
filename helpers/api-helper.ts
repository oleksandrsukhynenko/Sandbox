import { APIRequestContext } from '@playwright/test';
import { registrationFormData } from '../data/user-registration-form.data';

/**
 * Generates an authorization token via API.
 * @param request - the Playwright API request context
 * @param userName - the user name to generate the token for, defaults to the shared test user
 * @param password - the password to generate the token with, defaults to the shared test user
 * @returns The bearer token of the user
 */
async function generateToken(
	request: APIRequestContext,
	userName: string = registrationFormData.userName,
	password: string = registrationFormData.password
): Promise<string> {
	const response = await request.post('/Account/v1/GenerateToken', {
		data: { userName, password },
	});
	const { token } = await response.json();
	return token;
}

/**
 * Creates a user via API.
 * @param request - the Playwright API request context
 * @param userName - the user name to create, defaults to the shared test user
 * @param password - the password to create the user with, defaults to the shared test user
 * @returns The id of the created user
 */
export async function createUser(
	request: APIRequestContext,
	userName: string = registrationFormData.userName,
	password: string = registrationFormData.password
): Promise<string> {
	const response = await request.post('/Account/v1/User', {
		data: { userName, password },
	});
	const { userID } = await response.json();
	return userID;
}

/**
 * Deletes the user via API using a freshly generated token.
 * @param request - the Playwright API request context
 * @param userId - the id of the user to delete
 * @param userName - the user name to generate the token with, defaults to the shared test user
 * @param password - the password to generate the token with, defaults to the shared test user
 */
export async function deleteUser(
	request: APIRequestContext,
	userId: string,
	userName: string = registrationFormData.userName,
	password: string = registrationFormData.password
): Promise<void> {
	const token = await generateToken(request, userName, password);

	await request.delete(`/Account/v1/User/${userId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
}

/**
 * Adds a book to the user's collection via API.
 * @param request - the Playwright API request context
 * @param userId - the id of the user who owns the collection
 * @param isbn - the ISBN of the book to add
 */
export async function addBookToCollection(request: APIRequestContext, userId: string, isbn: string): Promise<void> {
	const token = await generateToken(request);

	await request.post('/BookStore/V1/Books', {
		headers: { Authorization: `Bearer ${token}` },
		data: {
			userId,
			collectionOfIsbns: [{ isbn }],
		},
	});
}
