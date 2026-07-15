import { Page } from "@playwright/test";

export class MainNavigationMenu {
	constructor(private page: Page) {}
	async navigateToPracticeFormByClicks() {
		await this.page.goto('/');
		await this.page.getByRole('heading', { name: 'Forms' }).click();
		await this.page.getByRole('link', { name: 'Practice Form' }).click();
	}

}