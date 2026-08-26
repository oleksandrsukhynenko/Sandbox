import { test, expect } from '@playwright/test';
import { ProfileFormPage } from '../pages/profile-form.page';
import { bookStoreData } from '../data/book-store.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';
import { login, createUser, deleteUser } from '../helpers/auth-helper';
import { addBookToCollection } from '../helpers/book-store-helper';

let userId: string;

test.beforeAll(async ({ request }) => {
	userId = await createUser(request);
	await addBookToCollection(request, userId, bookStoreData.GitPocketGuide.isbn);
});

test('Deleting Book From Your Collection', async ({ page }) => {
	const mainNavigationMenu = new MainNavigationMenu(page);
	const profileForm = new ProfileFormPage(page);
	const book = bookStoreData.GitPocketGuide;

	await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Login);
	await login(page);
	await expect(profileForm.logoutButton).toBeVisible();

	await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Profile);
	await expect(profileForm.bookTitleInCollection(book.title)).toBeVisible();
	await profileForm.deleteBookButton(book.isbn).click();
	await expect(profileForm.deleteBookModalTitle).toHaveText('Delete Book');
	await expect(profileForm.deleteBookModalBody).toHaveText('Do you want to delete this book?');
	await expect(profileForm.okButton).toBeVisible();
	await expect(profileForm.cancelButton).toBeVisible();
	await profileForm.cancelButton.click();
	await expect(profileForm.deleteBookModalTitle).not.toBeVisible();
	await profileForm.deleteBookButton(book.isbn).click();
	await profileForm.okButton.click();
	await expect(profileForm.deleteBookModalTitle).not.toBeVisible();
	await expect(profileForm.bookTitleInCollection(book.title)).not.toBeVisible();
});

test.afterAll(async ({ request }) => {
	await deleteUser(request, userId);
});