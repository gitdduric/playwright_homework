import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Home page is opened and Welcome message is displayed 1', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
});

// 1. Select the PET TYPES menu item in the navigation bar
test('Select the Pet Types menu item in the navigation bar', async ({page}) => {
  await page.getByRole('link', {name: 'Pet Types'}).click()
  // check that clicking the link opens /pettypes and that the page heading reads "Pet Types"
  await expect(page).toHaveURL('/pettypes')
  await expect(page.locator('h2')).toHaveText('Pet Types')
});


