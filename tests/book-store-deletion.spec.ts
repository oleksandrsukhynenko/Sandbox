import { test } from '@playwright/test';
import { ProfileFormPage } from '../pages/profile-form/profile-form.page';
import { bookStoreData } from '../data/book-store.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu/main-navigation-menu.page';
import { login } from '../helpers/ui-helper';
import { createUser, deleteUser, addBookToCollection } from '../helpers/api-helper';

test.describe('Book deletion management', () => {
	const book = bookStoreData.GitPocketGuide;

	let userId: string;
	let mainNavigationMenu: MainNavigationMenu;
	let profileForm: ProfileFormPage;

	test.beforeAll(async ({ request }) => {
		userId = await createUser(request);
		await addBookToCollection(request, userId, book.isbn);
	});

	test.beforeEach(async ({ page }) => {
		mainNavigationMenu = new MainNavigationMenu(page);
		profileForm = new ProfileFormPage(page);

		await test.step('Login to book store', async () => {
			await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Login);
			await login(page);
			await profileForm.expectLocatorToBeVisible(profileForm.logoutButton, true);
		});
	});

	test('Deleting Book From Your Collection', { tag: '@smoke' }, async () => {
		await test.step('Open delete modal and cancel', async () => {
			await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Profile);
			await profileForm.expectLocatorToBeVisible(profileForm.bookTitleInCollection(book.title), true);
			await profileForm.deleteBookButton(book.isbn).click();
			await profileForm.expectLocatorToHaveText(profileForm.deleteBookModalTitle, 'Delete Book');
			await profileForm.expectLocatorToHaveText(profileForm.deleteBookModalBody, 'Do you want to delete this book?');
			await profileForm.expectLocatorToBeVisible(profileForm.okButton, true);
			await profileForm.expectLocatorToBeVisible(profileForm.cancelButton, true);
			await profileForm.cancelButton.click();
			await profileForm.expectLocatorToBeVisible(profileForm.deleteBookModalTitle, false);
		});

		await test.step('Confirm deletion and verify book removed', async () => {
			await profileForm.deleteBookButton(book.isbn).click();
			await profileForm.okButton.click();
			await profileForm.expectLocatorToBeVisible(profileForm.deleteBookModalTitle, false);
			await profileForm.expectLocatorToBeVisible(profileForm.bookTitleInCollection(book.title), false);
		});
	});

	test.afterAll(async ({ request }) => {
		await deleteUser(request, userId);
	});
});
