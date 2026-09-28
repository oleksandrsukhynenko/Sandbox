import { registrationFormData } from '../data/registration-form.data';
import { RegistrationFormLocators } from './registration-form.locators';

export class RegistrationFormActions extends RegistrationFormLocators {
	/**
	 * Reads the confirmation modal table.
	 * @returns Map where the key is the row label and the value is the submitted value
	 */
	async getConfirmationData(): Promise<Record<string, string>> {
		const rows = this.confirmationRows;
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

	/**
	 * Checks the gender radio button.
	 * @param gender - the gender to select
	 */
	async selectGender(gender: 'Male' | 'Female' | 'Other') {
		await this.genderRadio(gender).check();
	}

	/**
	 * Checks the hobby checkbox.
	 * @param hobby - the hobby to select
	 */
	async selectHobby(hobby: 'Sports' | 'Reading' | 'Music') {
		await this.hobbyCheckbox(hobby).check();
	}

	/**
	 * Replaces the date of birth value and closes the date picker with Enter.
	 * @param date - the date in the format shown by the picker, e.g. '15 Jun 1990'
	 */
	async setDateOfBirth(date: string) {
		await this.dateOfBirthInput.click({ clickCount: 3 });
		await this.dateOfBirthInput.fill(date);
		await this.page.keyboard.press('Enter');
	}

	/**
	 * Types a subject and picks the matching option from the autocomplete list.
	 * @param subject - the subject name to add
	 */
	async addSubject(subject: string) {
		await this.subjectsInput.fill(subject);
		await this.option(subject).click();
	}

	/**
	 * Picks a state from the dropdown.
	 * @param state - the state name to select
	 */
	async selectState(state: string) {
		await this.stateDropdown.click();
		await this.stateInput.fill(state);
		await this.option(state).click();
	}

	/**
	 * Picks a city from the dropdown; requires a state to be selected first.
	 * @param city - the city name to select
	 */
	async selectCity(city: string) {
		await this.cityDropdown.click();
		await this.cityInput.fill(city);
		await this.option(city).click();
	}

	/**
	 * Fills all mandatory fields with valid data except the given one.
	 * @param excludedField - the name of the field to be excluded from filling; pass an unknown name (e.g. 'none') to fill them all
	 */
	async fillMandatoryFieldsExcept(excludedField: string) {
		const fields = {
			firstName: async () => await this.firstName.fill(registrationFormData.firstName),
			lastName: async () => await this.lastName.fill(registrationFormData.lastName),
			gender: async () => await this.selectGender(registrationFormData.gender),
			mobileNumber: async () => await this.mobileNumber.fill(registrationFormData.mobileNumber)
		};

		for (const [fieldName, fillMethod] of Object.entries(fields)) {
			if (fieldName !== excludedField) {
				await fillMethod();
			}
		}
	}
}
