import { test } from '@playwright/test';
import { ProfileFormPage } from '../pages/profile-form.page';
import { BookStorePage } from '../pages/book-store.page';
import { bookStoreData } from '../data/book-store.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';
import { login, createUser, deleteUser } from '../helpers/auth-helper';
import { addBookToCollection } from '../helpers/book-store-helper';

test.describe('Book store suite', () => {
	test.describe('Book collection management', () => {
		let userId: string;

		test.beforeAll(async ({ request }) => {
			userId = await createUser(request);
		});

		test('Adding Book To Your Collection', async ({ page }) => {
			const mainNavigationMenu = new MainNavigationMenu(page);
			const profileForm = new ProfileFormPage(page);
			const bookStorePage = new BookStorePage(page);
			const book = bookStoreData.GitPocketGuide;

			await test.step('Login to book store', async () => {
				await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Login);
				await login(page);
				await profileForm.isLocatorVisible(profileForm.logoutButton, true);
			});

			await test.step('Add book to collection', async () => {
				await mainNavigationMenu.navigateTo(Sections.BookStore, Links.BookStore);
				await bookStorePage.searchInput.fill(book.title);
				await bookStorePage.bookTitleLink(book.title).click();
				await bookStorePage.addToCollectionButton.click();
			});

			await test.step('Verify book in profile collection', async () => {
				await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Profile);
				await profileForm.isLocatorVisible(profileForm.bookTitleInCollection(book.title), true);
				await profileForm.isLocatorVisible(profileForm.bookAuthorInCollection(book.author), true);
				await profileForm.isLocatorVisible(profileForm.bookPublisherInCollection(book.publisher), true);
				await profileForm.isLocatorVisible(profileForm.bookImage, true);
			});
		});

		test.afterAll(async ({ request }) => {
			await deleteUser(request, userId);
		});
	});

	test.describe('Book deletion management', () => {
		let userId: string;

		test.beforeAll(async ({ request }) => {
			userId = await createUser(request);
			await addBookToCollection(request, userId, bookStoreData.GitPocketGuide.isbn);
		});

		test('Deleting Book From Your Collection', async ({ page }) => {
			const mainNavigationMenu = new MainNavigationMenu(page);
			const profileForm = new ProfileFormPage(page);
			const book = bookStoreData.GitPocketGuide;

			await test.step('Login to book store', async () => {
				await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Login);
				await login(page);
				await profileForm.isLocatorVisible(profileForm.logoutButton, true);
			});

			await test.step('Open delete modal and cancel', async () => {
				await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Profile);
				await profileForm.isLocatorVisible(profileForm.bookTitleInCollection(book.title), true);
				await profileForm.deleteBookButton(book.isbn).click();
				await profileForm.isLocatorText(profileForm.deleteBookModalTitle, 'Delete Book');
				await profileForm.isLocatorText(profileForm.deleteBookModalBody, 'Do you want to delete this book?');
				await profileForm.isLocatorVisible(profileForm.okButton, true);
				await profileForm.isLocatorVisible(profileForm.cancelButton, true);
				await profileForm.cancelButton.click();
				await profileForm.isLocatorVisible(profileForm.deleteBookModalTitle, false);
			});

			await test.step('Confirm deletion and verify book removed', async () => {
				await profileForm.deleteBookButton(book.isbn).click();
				await profileForm.okButton.click();
				await profileForm.isLocatorVisible(profileForm.deleteBookModalTitle, false);
				await profileForm.isLocatorVisible(profileForm.bookTitleInCollection(book.title), false);
			});
		});

		test.afterAll(async ({ request }) => {
			await deleteUser(request, userId);
		});
	});

	test.describe('Book store search', () => {
		let userId: string;

		test.beforeAll(async ({ request }) => {
			userId = await createUser(request);
		});

		test('Search Book In Book Store', async ({ page }) => {
			const mainNavigationMenu = new MainNavigationMenu(page);
			const bookStorePage = new BookStorePage(page);
			const book = bookStoreData.GitPocketGuide;

			await test.step('Login to book store', async () => {
				await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Login);
				await login(page);
			});

			await test.step('Search for book and verify it is found', async () => {
				await mainNavigationMenu.navigateTo(Sections.BookStore, Links.BookStore);
				await bookStorePage.searchInput.fill(book.title);
				await bookStorePage.isLocatorVisible(bookStorePage.bookTitleLink(book.title), true);
			});
		});

		test.afterAll(async ({ request }) => {
			await deleteUser(request, userId);
		});
	});
});
