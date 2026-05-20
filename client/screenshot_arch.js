import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const filePath = 'file:///home/ckeiner/Programming/inventory-management/architecture.html';
  console.log(`Loading: ${filePath}`);

  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Wait a bit for any animations or rendering
  await new Promise(resolve => setTimeout(resolve, 1000));

  const screenshotPath = '/tmp/architecture_screenshot.png';
  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  console.log(`Screenshot saved to: ${screenshotPath}`);

  await browser.close();
})();
