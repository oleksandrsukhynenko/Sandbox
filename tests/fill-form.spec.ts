import { test, expect } from '@playwright/test';
import { RegistrationFormPage } from '../pages/registration-form.page';
import { registrationFormData } from '../data/registration-form.data';

test('Fill form', async ({ page }) => {
  const registrationForm = new RegistrationFormPage(page);
  await registrationForm.navigateByClicks();
  const data = registrationFormData;

  await expect(registrationForm.heading).toBeVisible();

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

  await expect(registrationForm.confirmationModal).toBeVisible();
  await expect(registrationForm.confirmationModal).toHaveText('Thanks for submitting the form');

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




