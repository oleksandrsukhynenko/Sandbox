import { Page } from "@playwright/test";

export const Sections = {
	Forms: 'Forms',
	BookStore: 'Book Store Application',
} as const;

export const Links = {
	PracticeForm: 'Practice Form',
	BookStore: 'Book Store',
	Login: 'Login',
	Profile: 'Profile',
} as const;

export class MainNavigationMenu {
	constructor(private page: Page) {}

	async navigateTo(section: string, link: string) {
		await this.page.goto('/');
		await this.page.getByRole('heading', { name: section }).click();
		await this.page.getByRole('link', { name: link, exact: true }).click();
	}

}