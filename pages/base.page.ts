import { expect, Locator, Page } from "@playwright/test";

export class BasePage {
	constructor(protected page: Page) {}

	async isLocatorVisible(locator: Locator, isVisible: boolean) {
		if (isVisible) {
			await expect(locator).toBeVisible();
			return;
		}

		await expect(locator).not.toBeVisible();
	}

	async isLocatorText(locator: Locator, expectedText: string | RegExp | ReadonlyArray<string | RegExp>) {
		await expect(locator).toHaveText(expectedText);
	}
}