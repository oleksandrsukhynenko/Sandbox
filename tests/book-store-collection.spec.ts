import { test } from '@playwright/test';
import { ProfileFormPage } from '../pages/profile-form.page';
import { BookStorePage } from '../pages/book-store.page';
import { bookStoreData } from '../data/book-store.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';
import { login } from '../helpers/ui-helper';
import { createUser, deleteUser } from '../helpers/api-helper';

test.describe('Book collection management and search', () => {
	const book = bookStoreData.GitPocketGuide;

	let userId: string;
	let mainNavigationMenu: MainNavigationMenu;
	let profileForm: ProfileFormPage;
	let bookStorePage: BookStorePage;

	test.beforeAll(async ({ request }) => {
		userId = await createUser(request);
	});

	test.beforeEach(async ({ page }) => {
		mainNavigationMenu = new MainNavigationMenu(page);
		profileForm = new ProfileFormPage(page);
		bookStorePage = new BookStorePage(page);

		await test.step('Login to book store', async () => {
			await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Login);
			await login(page);
			await profileForm.expectLocatorToBeVisible(profileForm.logoutButton, true);
		});
	});

	test('Adding Book To Your Collection', { tag: '@smoke' }, async () => {
		await test.step('Add book to collection', async () => {
			await mainNavigationMenu.navigateTo(Sections.BookStore, Links.BookStore);
			await bookStorePage.searchInput.fill(book.title);
			await bookStorePage.bookTitleLink(book.title).click();
			await bookStorePage.addToCollectionButton.click();
		});

		await test.step('Verify book in profile collection', async () => {
			await mainNavigationMenu.navigateTo(Sections.BookStore, Links.Profile);
			await profileForm.expectLocatorToBeVisible(profileForm.bookTitleInCollection(book.title), true);
			await profileForm.expectLocatorToBeVisible(profileForm.bookAuthorInCollection(book.author), true);
			await profileForm.expectLocatorToBeVisible(profileForm.bookPublisherInCollection(book.publisher), true);
			await profileForm.expectLocatorToBeVisible(profileForm.bookImage, true);
		});
	});

	test('Search Book In Book Store', { tag: '@smoke' }, async () => {
		await test.step('Search for book and verify it is found', async () => {
			await mainNavigationMenu.navigateTo(Sections.BookStore, Links.BookStore);
			await bookStorePage.searchInput.fill(book.title);
			await bookStorePage.expectLocatorToBeVisible(bookStorePage.bookTitleLink(book.title), true);
		});
	});

	test.afterAll(async ({ request }) => {
		await deleteUser(request, userId);
	});
});
