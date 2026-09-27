import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Home page is opened and Welcome message is displayed 1', async ({page}) => {
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
});

test('Edit the "cat" pet type', async ({page}) => {
  await test.step('1. Select the PET TYPES menu item in the navigation bar', async () => {
    await page.getByRole('link', {name: 'Pet Types'}).click()
    // check that clicking the link opens /pettypes
    await expect(page).toHaveURL('/pettypes')
  })

  await test.step('2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types', async () => {
    await expect(page.getByRole('heading', {name: 'Pet Types'})).toHaveText('Pet Types')
  })

  await test.step('3. Click on "Edit" button for the "cat" pet type', async () => {
    await page.getByRole('row').filter({has: page.getByRole('cell', {name: 'cat', exact: true})}).getByRole('button', {name: 'Edit'}).click()
  })
});


