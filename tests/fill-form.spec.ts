import { test, expect } from '@playwright/test';
import { RegistrationFormPage } from '../pages/registration-form.page';
import { registrationFormData } from '../data/registration-form.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';

test.describe('Practice form suite', () => {
  test('Fill form', async ({ page }) => {
    const registrationForm = new RegistrationFormPage(page);
    const mainNavigationMenu = new MainNavigationMenu(page);
    const data = registrationFormData;

    await test.step('Open practice form', async () => {
      await mainNavigationMenu.navigateTo(Sections.Forms, Links.PracticeForm);
      await registrationForm.isLocatorVisible(registrationForm.heading, true);
    });

    await test.step('Fill and submit registration form', async () => {
      await registrationForm.firstName.fill(data.firstName);
      await registrationForm.lastName.fill(data.lastName);
      await registrationForm.email.fill(data.email);
      await registrationForm.selectGender(data.gender);
      await registrationForm.mobileNumber.fill(data.mobileNumber);
      await registrationForm.setDateOfBirth(data.dateOfBirth);
      for (const subject of data.subjects) {
        await registrationForm.addSubject(subject);
      }
      for (const hobby of data.hobbies) {
        await registrationForm.selectHobby(hobby);
      }
      await registrationForm.currentAddress.fill(data.currentAddress);
      await registrationForm.selectState(data.state);
      await registrationForm.selectCity(data.city);
      await registrationForm.submitButton.click();
    });

    await test.step('Verify confirmation modal and submitted data', async () => {
      await registrationForm.isLocatorVisible(registrationForm.confirmationModal, true);
      await registrationForm.isLocatorText(registrationForm.confirmationModal, 'Thanks for submitting the form');

      const confirmation = await registrationForm.getConfirmationData();
      expect(confirmation['Student Name']).toBe(`${data.firstName} ${data.lastName}`);
      expect(confirmation['Student Email']).toBe(data.email);
      expect(confirmation['Gender']).toBe(data.gender);
      expect(confirmation['Mobile']).toBe(data.mobileNumber);
      expect(confirmation['Subjects']).toBe(data.subjects.join(', '));
      expect(confirmation['Hobbies']).toBe(data.hobbies.join(', '));
      expect(confirmation['Address']).toBe(data.currentAddress);
      expect(confirmation['State and City']).toBe(`${data.state} ${data.city}`);
    });
  });

  const mandatoryFields = [
    { name: 'First Name', field: 'firstName' },
    { name: 'Last Name', field: 'lastName' },
    { name: 'Gender', field: 'gender' },
    { name: 'Mobile', field: 'mobileNumber' }
  ] as const;

  for (const mandatoryField of mandatoryFields) {
    test(`${mandatoryField.name} should be mandatory`, async ({ page }) => {
      const registrationForm = new RegistrationFormPage(page);
      const mainNavigationMenu = new MainNavigationMenu(page);

      await test.step('Open practice form', async () => {
        await mainNavigationMenu.navigateTo(Sections.Forms, Links.PracticeForm);
      });

      await test.step('Submit form without required field', async () => {
        // Fill all mandatory fields except the one being tested
        await registrationForm.fillMandatoryFieldsExcept(
          mandatoryField.field
        );
        await registrationForm.submitButton.click();
      });

      await test.step('Verify validation for required field', async () => {
        // Check that form wasn't submitted and the mandatory field is highlighted
        await registrationForm.isLocatorVisible(registrationForm.confirmationModal, false);

        // .and(page.locator(':invalid')) narrows the locator to elements matching native validation errors.
        await registrationForm.isLocatorVisible(
          registrationForm[mandatoryField.field].and(page.locator(':invalid')),
          true
        );
      });
    });
  }

  test('Mobile Number verification', async ({ page }) => {
    const data = registrationFormData;
    const invalidMobileNumbers = [
      data.invalidMobileNumberLess10,
      data.invalidMobileNumberLetter,
      data.invalidMobileNumberSymbol
    ];

    const registrationForm = new RegistrationFormPage(page);
    const mainNavigationMenu = new MainNavigationMenu(page);

    await test.step('Open practice form and fill mandatory fields', async () => {
      await mainNavigationMenu.navigateTo(Sections.Forms, Links.PracticeForm);
      // Fill all mandatory fields except the one being tested
      await registrationForm.fillMandatoryFieldsExcept('mobileNumber');
    });

    for (const invalidMobileNumber of invalidMobileNumbers) {
      await test.step(`Validate invalid mobile number: ${invalidMobileNumber}`, async () => {
        await registrationForm.mobileNumber.fill(invalidMobileNumber);

        // Send the form
        await registrationForm.submitButton.click();

        // Check that form wasn't submitted and the Mobile Number field is highlighted
        await registrationForm.isLocatorVisible(registrationForm.confirmationModal, false);

        // .and(page.locator(':invalid')) narrows the locator to elements matching native validation errors.
        await registrationForm.isLocatorVisible(
          registrationForm.mobileNumber.and(page.locator(':invalid')),
          true
        );
        await registrationForm.mobileNumber.clear();
      });
    }
  });

  test('Submit form only with required fields', async ({ page }) => {
    const registrationForm = new RegistrationFormPage(page);
    const mainNavigationMenu = new MainNavigationMenu(page);

    await test.step('Open practice form and fill only required fields', async () => {
      await mainNavigationMenu.navigateTo(Sections.Forms, Links.PracticeForm);

      // Fill all mandatory fields except the one being tested
      await registrationForm.fillMandatoryFieldsExcept('none');
    });

    await test.step('Submit and verify successful confirmation', async () => {
      // Send the form
      await registrationForm.submitButton.click();
      await registrationForm.isLocatorVisible(registrationForm.confirmationModal, true);
      await registrationForm.isLocatorText(registrationForm.confirmationModal, 'Thanks for submitting the form');
    });
  });
});




