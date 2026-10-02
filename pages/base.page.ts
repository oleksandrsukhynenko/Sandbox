import { expect, Locator, Page } from "@playwright/test";

export class BasePage {
	constructor(protected page: Page) {}

	/**
	 * Asserts the visibility state of the locator.
	 * @param locator - the locator to check
	 * @param isVisible - true to expect the element to be visible, false to expect it to be hidden
	 */
	async expectLocatorToBeVisible(locator: Locator, isVisible: boolean) {
		if (isVisible) {
			await expect(locator).toBeVisible();
			return;
		}

		await expect(locator).not.toBeVisible();
	}

	/**
	 * Asserts that the locator has the expected text.
	 * @param locator - the locator to check
	 * @param expectedText - the expected text, a regular expression, or an array of them for multiple elements
	 */
	async expectLocatorToHaveText(locator: Locator, expectedText: string | RegExp | ReadonlyArray<string | RegExp>) {
		await expect(locator).toHaveText(expectedText);
	}
}