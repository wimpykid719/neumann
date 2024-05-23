import puppeteer from 'puppeteer'
;(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto('https://example.com')
  await browser.close()
  console.log('done')
})()
