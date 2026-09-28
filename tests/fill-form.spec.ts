import { test, expect } from '@playwright/test';
import { RegistrationFormPage } from '../pages/registration-form.page';
import { registrationFormData } from '../data/registration-form.data';
import { MainNavigationMenu, Sections, Links } from '../pages/main-navigation-menu.page';

test.describe('Practice form suite', () => {
  const mandatoryFields = [
    { name: 'First Name', field: 'firstName' },
    { name: 'Last Name', field: 'lastName' },
    { name: 'Gender', field: 'gender' },
    { name: 'Mobile', field: 'mobileNumber' }
  ] as const;
  const invalidMobileNumbers = [
    registrationFormData.invalidMobileNumberLess10,
    registrationFormData.invalidMobileNumberLetter,
    registrationFormData.invalidMobileNumberSymbol
  ];

  let registrationForm: RegistrationFormPage;
  let mainNavigationMenu: MainNavigationMenu;

  test.beforeEach(async ({ page }) => {
    registrationForm = new RegistrationFormPage(page);
    mainNavigationMenu = new MainNavigationMenu(page);

    await test.step('Open practice form', async () => {
      await mainNavigationMenu.navigateTo(Sections.Forms, Links.PracticeForm);
      await registrationForm.expectLocatorToBeVisible(registrationForm.heading, true);
    });
  });

  test('Fill form', { tag: '@smoke' }, async () => {
    await test.step('Fill and submit registration form', async () => {
      await registrationForm.firstName.fill(registrationFormData.firstName);
      await registrationForm.lastName.fill(registrationFormData.lastName);
      await registrationForm.email.fill(registrationFormData.email);
      await registrationForm.selectGender(registrationFormData.gender);
      await registrationForm.mobileNumber.fill(registrationFormData.mobileNumber);
      await registrationForm.setDateOfBirth(registrationFormData.dateOfBirth);
      for (const subject of registrationFormData.subjects) {
        await registrationForm.addSubject(subject);
      }
      for (const hobby of registrationFormData.hobbies) {
        await registrationForm.selectHobby(hobby);
      }
      await registrationForm.currentAddress.fill(registrationFormData.currentAddress);
      await registrationForm.selectState(registrationFormData.state);
      await registrationForm.selectCity(registrationFormData.city);
      await registrationForm.submitButton.click();
    });

    await test.step('Verify confirmation modal and submitted data', async () => {
      await registrationForm.expectLocatorToBeVisible(registrationForm.confirmationModal, true);
      await registrationForm.expectLocatorToHaveText(registrationForm.confirmationModal, 'Thanks for submitting the form');

      const confirmation = await registrationForm.getConfirmationData();
      expect(confirmation['Student Name']).toBe(`${registrationFormData.firstName} ${registrationFormData.lastName}`);
      expect(confirmation['Student Email']).toBe(registrationFormData.email);
      expect(confirmation['Gender']).toBe(registrationFormData.gender);
      expect(confirmation['Mobile']).toBe(registrationFormData.mobileNumber);
      expect(confirmation['Subjects']).toBe(registrationFormData.subjects.join(', '));
      expect(confirmation['Hobbies']).toBe(registrationFormData.hobbies.join(', '));
      expect(confirmation['Address']).toBe(registrationFormData.currentAddress);
      expect(confirmation['State and City']).toBe(`${registrationFormData.state} ${registrationFormData.city}`);
    });
  });

  for (const mandatoryField of mandatoryFields) {
    test(`${mandatoryField.name} should be mandatory`, async ({ page }) => {
      await test.step('Submit form without required field', async () => {
        await registrationForm.fillMandatoryFieldsExcept(
          mandatoryField.field
        );
        await registrationForm.submitButton.click();
      });

      await test.step('Verify validation for required field', async () => {
        await registrationForm.expectLocatorToBeVisible(registrationForm.confirmationModal, false);

        // .and(page.locator(':invalid')) narrows the locator to elements matching native validation errors.
        await registrationForm.expectLocatorToBeVisible(
          registrationForm[mandatoryField.field].and(page.locator(':invalid')),
          true
        );
      });
    });
  }

  test('Mobile Number verification', async ({ page }) => {
    await test.step('Fill mandatory fields except mobile number', async () => {
      await registrationForm.fillMandatoryFieldsExcept('mobileNumber');
    });

    for (const invalidMobileNumber of invalidMobileNumbers) {
      await test.step(`Validate invalid mobile number: ${invalidMobileNumber}`, async () => {
        await registrationForm.mobileNumber.fill(invalidMobileNumber);
        await registrationForm.submitButton.click();

        await registrationForm.expectLocatorToBeVisible(registrationForm.confirmationModal, false);
        await registrationForm.expectLocatorToBeVisible(
          registrationForm.mobileNumber.and(page.locator(':invalid')),
          true
        );
        await registrationForm.mobileNumber.clear();
      });
    }
  });

  test('Submit form only with required fields', { tag: '@smoke' }, async () => {
    await test.step('Fill only required fields', async () => {
      await registrationForm.fillMandatoryFieldsExcept('none');
    });

    await test.step('Submit and verify successful confirmation', async () => {
      await registrationForm.submitButton.click();
      await registrationForm.expectLocatorToBeVisible(registrationForm.confirmationModal, true);
      await registrationForm.expectLocatorToHaveText(registrationForm.confirmationModal, 'Thanks for submitting the form');
    });
  });
});




