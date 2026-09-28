import { BasePage } from './base.page';

export class RegistrationFormLocators extends BasePage {
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

	get gender() {
		return this.page.getByRole('radio', { name: 'Male' }).first();
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

	get confirmationRows() {
		return this.page.locator('.table-responsive table tbody tr');
	}

	get stateDropdown() {
		return this.page.locator('#state');
	}

	get stateInput() {
		return this.page.locator('#react-select-3-input');
	}

	get cityDropdown() {
		return this.page.locator('#city');
	}

	get cityInput() {
		return this.page.locator('#react-select-4-input');
	}

	genderRadio(gender: string) {
		return this.page.getByRole('radio', { name: gender, exact: true });
	}

	hobbyCheckbox(hobby: string) {
		return this.page.getByRole('checkbox', { name: hobby });
	}

	/** Option of a dropdown or autocomplete list, matched by its exact text. */
	option(name: string) {
		return this.page.getByText(name, { exact: true });
	}
}
