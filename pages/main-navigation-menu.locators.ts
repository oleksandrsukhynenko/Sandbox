import { BasePage } from './base.page';

export class MainNavigationMenuLocators extends BasePage {
	sectionHeading(section: string) {
		return this.page.getByRole('heading', { name: section });
	}

	sectionLink(link: string) {
		return this.page.getByRole('link', { name: link, exact: true });
	}
}
