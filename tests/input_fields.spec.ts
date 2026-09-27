import { test, expect, type Page } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach( async({page}) => {
    await page.goto('/')
  })

  test('Home page is opened and Welcome message is displayed 1', async ({page}) => {
    await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  });
});

test.describe('Edit the "cat" pet type', () => {
  // the tests continue on the same page, so they must run in order
  test.describe.configure({mode: 'serial'})

  let page: Page

  test.beforeAll( async({browser}) => {
    page = await browser.newPage()
    // the app seeds its data on start-up; wait for it so the tests don't race it
    const seedResponse = page.waitForResponse('**/api/seed')
    await page.goto('/')
    await seedResponse
  })

  test.afterAll( async() => {
    await page.close()
  })

  test('1. Select the PET TYPES menu item in the navigation bar', async () => {
    await page.getByRole('link', {name: 'Pet Types'}).click()
    // check that clicking the link opens /pettypes
    await expect(page).toHaveURL('/pettypes')
  })

  test('2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types', async () => {
    await expect(page.getByRole('heading', {name: 'Pet Types'})).toHaveText('Pet Types')
  })

  test('3. Click on "Edit" button for the "cat" pet type', async () => {
    await page.getByRole('row').filter({has: page.getByRole('cell', {name: 'cat', exact: true})}).getByRole('button', {name: 'Edit'}).click()
  })

  test('4. Add assertion of the "Edit Pet Type" text displayed', async () => {
    await expect(page.getByRole('heading', {name: 'Edit Pet Type'})).toHaveText('Edit Pet Type')
  })

  test('5. Change the pet type name from "cat" to "rabbit" and click "Update" button', async () => {
    const nameInput = page.locator('#name')
    // wait for the form to load the current name before replacing it
    await expect(nameInput).toHaveValue('cat')
    await nameInput.fill('rabbit')
    await page.getByRole('button', {name: 'Update'}).click()
  })

  test('6. Add the assertion that the first pet type in the list of types has a value "rabbit"', async () => {
    await expect(page.locator('[name="pettype_name"]').first()).toHaveValue('rabbit')
  })

  test('7. Click on "Edit" button for the same "rabbit" pet type', async () => {
    await page.getByRole('row').filter({has: page.getByRole('cell', {name: 'rabbit', exact: true})}).getByRole('button', {name: 'Edit'}).click()
    await expect(page.locator('#name')).toHaveValue('rabbit')
  })

  test('8. Change the pet type name back from "rabbit" to "cat" and click "Update" button', async () => {
    await page.locator('#name').fill('cat')
    await page.getByRole('button', {name: 'Update'}).click()
    // wait until the app returns to the list, so the update is saved before the test ends
    await expect(page).toHaveURL('/pettypes')
  })

  test('9. Add the assertion that the first pet type in the list of names has a value "cat"', async () => {
    await expect(page.locator('[name="pettype_name"]').first()).toHaveValue('cat')
  })
});
