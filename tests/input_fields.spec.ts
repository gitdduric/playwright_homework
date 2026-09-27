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

  await test.step('4. Add assertion of the "Edit Pet Type" text displayed', async () => {
    await expect(page.getByRole('heading', {name: 'Edit Pet Type'})).toHaveText('Edit Pet Type')
  })

  await test.step('5. Change the pet type name from "cat" to "rabbit" and click "Update" button', async () => {
    const nameInput = page.locator('#name')
    // wait for the form to load the current name before replacing it
    await expect(nameInput).toHaveValue('cat')
    await nameInput.fill('rabbit')
    await page.getByRole('button', {name: 'Update'}).click()
  })

  await test.step('6. Add the assertion that the first pet type in the list of types has a value "rabbit"', async () => {
    await expect(page.locator('[name="pettype_name"]').first()).toHaveValue('rabbit')
  })

  await test.step('7. Click on "Edit" button for the same "rabbit" pet type', async () => {
    await page.getByRole('row').filter({has: page.getByRole('cell', {name: 'rabbit', exact: true})}).getByRole('button', {name: 'Edit'}).click()
    await expect(page.locator('#name')).toHaveValue('rabbit')
  })
});


