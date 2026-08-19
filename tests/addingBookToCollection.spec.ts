import { test, expect } from '@playwright/test';
import { ProfileFormPage } from '../pages/profile-form.page';
import { BookStorePage } from '../pages/book-store.page';
import { registrationFormData } from '../data/user-registration-form.data';
import { bookStoreData } from '../data/book-store.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';
import { login } from '../helpers/auth-helper';

const data = registrationFormData;
let userId: string;

test.beforeAll(async ({ request }) => {
	const createResponse = await request.post('/Account/v1/User', {
		data: {
			userName: data.userName,
			password: data.password,
		},
	});
	const { userID } = await createResponse.json();
	userId = userID;
});

test('Adding Book To Your Collection', async ({ page }) => {
	const mainNavigationMenu = new MainNavigationMenu(page);
	const profileForm = new ProfileFormPage(page);
	const bookStorePage = new BookStorePage(page);
	const book = bookStoreData.GitPocketGuide;

	await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Login);
	await login(page);
	await expect(profileForm.logoutButton).toBeVisible();

	await mainNavigationMenu.navigateTo(Sections.BookStore, Links.BookStore);
	await bookStorePage.searchInput.fill(book.title);
	await bookStorePage.bookTitleLink(book.title).click();
	await bookStorePage.addToCollectionButton.click();

	await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Profile);
	await expect(profileForm.bookTitleInCollection(book.title)).toBeVisible();
	await expect(profileForm.bookAuthorInCollection(book.author)).toBeVisible();
	await expect(profileForm.bookPublisherInCollection(book.publisher)).toBeVisible();
	await expect(profileForm.bookImage).toBeVisible();
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