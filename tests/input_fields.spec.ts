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
  // check that clicking the link opens /pettypes
  await expect(page).toHaveURL('/pettypes')

  // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types
  await expect(page.getByRole('heading', {name: 'Pet Types'})).toHaveText('Pet Types')
});


