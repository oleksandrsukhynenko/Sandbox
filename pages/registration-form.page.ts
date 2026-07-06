import { Page } from "@playwright/test";

export class RegistrationFormPage {
	constructor(private page: Page) {}

	get heading() {
	    return this.page.getByRole('heading', { name: 'Practice Form' });
	}

	get firstName() {
	    return this.page.getByRole('textbox', { name: 'First Name' });
	}

	get lastName() {
        return this.page.getByRole('textbox', { name: 'Last Name' });
	}

	get email() {
		return this.page.getByRole('textbox', { name: 'name@example.com' });
	}

	get mobileNumber() {
		return this.page.getByRole('textbox', { name: 'Mobile Number' });
	}

	get dateOfBirthInput() {
		return this.page.locator('#dateOfBirthInput');
	}

	get subjectsInput() {
		return this.page.locator('#subjectsInput');
	}

	get currentAddress() {
		return this.page.getByRole('textbox', { name: 'Current Address' });
	}

	get submitButton() {
		return this.page.getByRole('button', { name: 'Submit' });
	}

	get confirmationModal() {
		return this.page.locator('.modal-title.h4');
	}

	async getConfirmationData(): Promise<Record<string, string>> {
		const rows = this.page.locator('.table-responsive table tbody tr');
		const count = await rows.count();
		const result: Record<string, string> = {};
		for (let i = 0; i < count; i++) {
			const cells = rows.nth(i).locator('td');
			const key = await cells.nth(0).innerText();
			const value = await cells.nth(1).innerText();
			result[key.trim()] = value.trim();
		}
		return result;
	}

	async selectGender(gender: 'Male' | 'Female' | 'Other') {
		await this.page.getByRole('radio', { name: gender, exact: true }).check({ force: true });
	}

	async selectHobby(hobby: 'Sports' | 'Reading' | 'Music') {
		await this.page.getByRole('checkbox', { name: hobby }).check({ force: true });
	}

	async setDateOfBirth(date: string) {
		await this.dateOfBirthInput.click({ clickCount: 3 });
		await this.dateOfBirthInput.fill(date);
		await this.page.keyboard.press('Enter');
	}

	async addSubject(subject: string) {
		await this.subjectsInput.fill(subject);
		await this.page.getByText(subject, { exact: true }).click();
	}

	async selectState(state: string) {
		await this.page.locator('#state').click();
		await this.page.locator('#react-select-3-input').fill(state);
		await this.page.getByText(state, { exact: true }).click();
	}

	async selectCity(city: string) {
		await this.page.locator('#city').click();
		await this.page.locator('#react-select-4-input').fill(city);
		await this.page.getByText(city, { exact: true }).click();
    }
}

