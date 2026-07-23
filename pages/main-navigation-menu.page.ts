import { Page } from "@playwright/test";

export class MainNavigationMenu {
	constructor(private page: Page) {}
	// Will be renamed
	async navigateToPracticeFormByClicks() {
		await this.page.goto('/');
		await this.page.getByRole('heading', { name: 'Forms' }).click();
		await this.page.getByRole('link', { name: 'Practice Form' }).click();
	}

	// Will be renamed
	async navigateToUserProfileByClicks() {
		await this.page.goto('/');
		await this.page.getByRole('heading', { name: 'Book Store Application' }).click();
		await this.page.getByRole('link', { name: 'Profile' }).click();
	}

}