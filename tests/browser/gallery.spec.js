import {test,expect} from '@playwright/test';

test('the React gallery loads the collection and a real image under the Pages base',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/FutureArchive/');
  await expect(page.locator('[data-print]')).toHaveCount(18);
  await expect(page.getByRole('heading',{name:'Code, cast in chrome.'})).toBeVisible();
  await expect.poll(()=>page.locator('.artwork-link img').first().evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy();
  expect(await page.locator('.artwork-link').first().getAttribute('href')).toBe('/FutureArchive/artworks/01-infinite-porch.webp');
  expect(errors).toEqual([]);
});
test('search and reset update the React-rendered collection',async({page})=>{
  await page.goto('/FutureArchive/');
  await page.getByRole('searchbox',{name:'Search projects'}).fill('VR fitness');
  await expect(page.locator('[data-print]')).toHaveCount(1);
  await expect(page.locator('#gallery h3')).toHaveText('Pulse 369');
  await page.getByRole('button',{name:'Reset filters'}).click();
  await expect(page.locator('[data-print]')).toHaveCount(18);
});
test('volume and category filters bound viewer navigation and return keyboard focus',async({page})=>{
  await page.goto('/FutureArchive/');
  await page.getByRole('combobox',{name:'Filter by volume'}).selectOption('2');
  await expect(page.locator('[data-print]')).toHaveCount(6);
  await page.getByRole('button',{name:/Art & music/}).click();
  await expect(page.locator('[data-print]')).toHaveCount(2);
  const trigger=page.locator('.artwork-link').first();await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#viewer-title')).toHaveText('Auralith369');
  await page.keyboard.press('ArrowRight');await expect(page.locator('#viewer-title')).toHaveText('The Silicon Louvre');
  await page.keyboard.press('ArrowRight');await expect(page.locator('#viewer-title')).toHaveText('Auralith369');
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test('a shared print URL restores filters, preserves credit, and downloads from the right path',async({page})=>{
  await page.goto('/FutureArchive/?q=Dustin#print-18');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#viewer-title')).toHaveText('GLO Pin');
  await expect(page.locator('#viewer-credit')).toHaveText('Original GLO concept: Dustin');
  await expect(page.getByRole('button',{name:'Next print'})).toBeDisabled();
  await expect(page.locator('#viewer-download')).toHaveAttribute('href','/FutureArchive/artworks/18-glo-pin.webp');
  await page.getByRole('button',{name:'Close artwork viewer'}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('searchbox',{name:'Search projects'})).toHaveValue('Dustin');
  await expect(page.locator('[data-print]')).toHaveCount(1);
  expect(new URL(page.url()).pathname).toBe('/FutureArchive/');
});
test('mobile search can recover from an empty result without horizontal overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/FutureArchive/');
  await page.getByRole('searchbox',{name:'Search projects'}).fill('zzzznomatch');
  await expect(page.getByRole('heading',{name:'No worlds found just yet.'})).toBeVisible();
  await page.getByRole('button',{name:'Show all 18 prints'}).click();
  await expect(page.locator('[data-print]')).toHaveCount(18);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test('the pre-rendered gallery and image links work with JavaScript disabled',async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});
  try{
    const page=await context.newPage();await page.goto('/FutureArchive/');
    await expect(page.locator('[data-print]')).toHaveCount(18);
    const href=await page.locator('.artwork-link').first().getAttribute('href');
    expect((await page.request.get(href)).status()).toBe(200);
    await expect(page.locator('[data-print="18"]')).toContainText('Original GLO concept: Dustin');
  }finally{await context.close();}
});
