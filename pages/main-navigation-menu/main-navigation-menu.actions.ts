import { MainNavigationMenuLocators } from './main-navigation-menu.locators';

export class MainNavigationMenuActions extends MainNavigationMenuLocators {
	/**
	 * Opens the home page and navigates to a link inside the given section.
	 * @param section - the section heading to expand, see the `Sections` constant
	 * @param link - the link to click inside the section, see the `Links` constant
	 */
	async navigateTo(section: string, link: string) {
		await this.page.goto('/');
		await this.sectionHeading(section).click();
		await this.sectionLink(link).click();
	}
}
