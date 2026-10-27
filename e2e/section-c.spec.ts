import {test,expect} from '@playwright/test';

test('large intestine Section C renders paired real anatomy views',async({page})=>{
  await page.goto('/');
  await page.getByTestId('reference-organ-large-intestine').click();
  await expect(page.locator('.expression-panel')).toHaveCount(2,{timeout:30000});
  await expect(page.locator('.expression-panel canvas')).toHaveCount(2,{timeout:30000});
  await expect(page.getByText('HPO data not yet available',{exact:true})).toBeVisible();
  await expect(page.locator('.model-error')).toHaveCount(0);
  await expect(page.locator('.viridis-strip')).toBeVisible();
  await expect(page.locator('.expression-panel').first().locator('.legend small')).toHaveCount(2);
});
