import { test, expect } from '@playwright/test';
import { ProfileFormPage } from '../pages/profile-form.page';
import { BookStorePage } from '../pages/book-store.page';
import { bookStoreData } from '../data/book-store.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';
import { login, createUser, deleteUser } from '../helpers/auth-helper';

let userId: string;

test.beforeAll(async ({ request }) => {
	userId = await createUser(request);
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
	await deleteUser(request, userId);
});