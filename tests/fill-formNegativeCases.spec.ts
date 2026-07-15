import { test, expect } from '@playwright/test';
import { RegistrationFormPage } from '../pages/registration-form.page';
import { registrationFormData } from '../data/registration-form.data';
import { MainNavigationMenu } from '../pages/main-navigation-menu';

const mandatoryFields = [
	{
		name: 'First Name',
		field: 'firstName'
	},
	{
		name: 'Last Name',
		field: 'lastName'
	},
	{
		name: 'Gender',
		field: 'gender'
	},
	{
		name: 'Mobile',
		field: 'mobileNumber'
	}
] as const;

for (const mandatoryField of mandatoryFields) {

	test(`${mandatoryField.name} should be mandatory`, async ({ page }) => {

		const registrationForm = new RegistrationFormPage(page);
		const mainNavigationMenu = new MainNavigationMenu(page);
		await mainNavigationMenu.navigateToPracticeFormByClicks();

		// Fill all mandatory fields except the one being tested
		await registrationForm.fillMandatoryFieldsExcept(
			mandatoryField.field
		);

		// Send the form
		await registrationForm.submitButton.click();

		// Check that form wasn't submitted and the mandatory field is highlighted
		await expect(
			registrationForm.confirmationModal
		).not.toBeVisible();

		await expect(
			registrationForm[mandatoryField.field]
		).toHaveCSS(
			'border-color',
			'rgb(220, 53, 69)'
		);

	});

}

test(`Mobile Number verification`, async ({ page }) => {

	const data = registrationFormData;
	const invalidMobileNumbers = [
		data.invalidMobileNumberLess10,
		data.invalidMobileNumberLetter,
		data.invalidMobileNumberSymbol
	];

	const registrationForm = new RegistrationFormPage(page);
	const mainNavigationMenu = new MainNavigationMenu(page);

	await mainNavigationMenu.navigateToPracticeFormByClicks();

	// Fill all mandatory fields except the one being tested
	await registrationForm.fillMandatoryFieldsExcept('mobileNumber');

	for (const invalidMobileNumber of invalidMobileNumbers) {
		await registrationForm.mobileNumber.fill(invalidMobileNumber);

		// Send the form
		await registrationForm.submitButton.click();

		// Check that form wasn't submitted and the Mobile Number field is highlighted
		await expect(
			registrationForm.confirmationModal
		).not.toBeVisible();

		await expect(
			registrationForm.mobileNumber
		).toHaveCSS(
			'border-color',
			'rgb(220, 53, 69)'
		);
		await registrationForm.mobileNumber.clear();
	}
});

test(`Submit form only with required fields`, async ({ page }) => {

	const registrationForm = new RegistrationFormPage(page);
	const mainNavigationMenu = new MainNavigationMenu(page);

	await mainNavigationMenu.navigateToPracticeFormByClicks();

	// Fill all mandatory fields except the one being tested
	await registrationForm.fillMandatoryFieldsExcept('none');

	// Send the form
	await registrationForm.submitButton.click();
	await expect(registrationForm.confirmationModal).toBeVisible();
 	await expect(registrationForm.confirmationModal).toHaveText('Thanks for submitting the form');

});