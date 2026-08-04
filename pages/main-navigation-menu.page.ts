import { Page } from "@playwright/test";

export class MainNavigationMenu {
	constructor(private page: Page) {}

	async navigateToPracticeForm() {
		await this.page.goto('/');
		await this.page.getByRole('heading', { name: 'Forms' }).click();
		await this.page.getByRole('link', { name: 'Practice Form' }).click();
	}

	async navigateToUserProfile() {
		await this.page.goto('/');
		await this.page.getByRole('heading', { name: 'Book Store Application' }).click();
		await this.page.getByRole('link', { name: 'Profile' }).click();
	}

}