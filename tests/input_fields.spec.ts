import { test, expect } from '@playwright/test';

test.describe('Pet Types', () => {
  // every test opens its own page, so the tests can run in parallel
  test.describe.configure({mode: 'parallel'})

  test.beforeEach( async({page}) => {
    await page.goto('/')

    // 1. Select the PET TYPES menu item in the navigation bar
    await page.getByRole('link', {name: 'Pet Types'}).click()
    await expect(page).toHaveURL('/pettypes')
  })

  test('"Pet Types" text is displayed above the table with the list of pet types', async ({page}) => {
    // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types
    await expect(page.getByRole('heading', {name: 'Pet Types'})).toHaveText('Pet Types')
  })

  test('Edit page of the first pet type is opened', async ({page}) => {
    // 3. Click on "Edit" button for the first pet type ("cat"); located by position, not by name,
    // because the "rename" test below temporarily renames "cat" to "rabbit" while it runs
    await page.getByRole('row').filter({has: page.getByRole('button', {name: 'Edit'})}).first().getByRole('button', {name: 'Edit'}).click()

    // 4. Add assertion of the "Edit Pet Type" text displayed
    await expect(page.getByRole('heading', {name: 'Edit Pet Type'})).toHaveText('Edit Pet Type')
  })

  test.describe('Rename', () => {
    // if the test fails between steps 5 and 8, "rabbit" is left in the account and breaks the next run;
    // this hook is scoped to the rename test only, so it can't undo the rename while that test runs
    test.afterEach( async({request}) => {
      const petTypesUrl = 'https://petclinic-api.bondaracademy.com/petclinic/api/pettypes'
      const petTypes: {id: number, name: string}[] = await (await request.get(petTypesUrl)).json()
      const rabbit = petTypes.find(petType => petType.name === 'rabbit')
      if (rabbit) {
        await request.put(`${petTypesUrl}/${rabbit.id}`, {data: {id: rabbit.id, name: 'cat'}})
      }
    })

    test('Rename the "cat" pet type to "rabbit" and back', async ({page}) => {
      const nameInput = page.locator('#name')
      const firstPetType = page.locator('[name="pettype_name"]').first()

      await test.step('3. Click on "Edit" button for the "cat" pet type', async () => {
        await page.getByRole('row').filter({has: page.getByRole('cell', {name: 'cat', exact: true})}).getByRole('button', {name: 'Edit'}).click()
      })

      await test.step('4. Add assertion of the "Edit Pet Type" text displayed', async () => {
        await expect(page.getByRole('heading', {name: 'Edit Pet Type'})).toHaveText('Edit Pet Type')
      })

      await test.step('5. Change the pet type name from "cat" to "rabbit" and click "Update" button', async () => {
        // wait for the form to load the current name before replacing it
        await expect(nameInput).toHaveValue('cat')
        await nameInput.fill('rabbit')
        await page.getByRole('button', {name: 'Update'}).click()
      })

      await test.step('6. Add the assertion that the first pet type in the list of types has a value "rabbit"', async () => {
        await expect(firstPetType).toHaveValue('rabbit')
      })

      await test.step('7. Click on "Edit" button for the same "rabbit" pet type', async () => {
        await page.getByRole('row').filter({has: page.getByRole('cell', {name: 'rabbit', exact: true})}).getByRole('button', {name: 'Edit'}).click()
        await expect(nameInput).toHaveValue('rabbit')
      })

      await test.step('8. Change the pet type name back from "rabbit" to "cat" and click "Update" button', async () => {
        await nameInput.fill('cat')
        await page.getByRole('button', {name: 'Update'}).click()
      })

      await test.step('9. Add the assertion that the first pet type in the list of names has a value "cat"', async () => {
        await expect(firstPetType).toHaveValue('cat')
      })
    })
  })
});
