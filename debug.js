const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  const filePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  console.log("Navigating to:", filePath);
  
  try {
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    console.log("Navigation complete.");
    
    // Check if body is clickable
    await page.evaluate(() => {
      document.body.click();
    });
    console.log("Body clicked successfully.");
    
  } catch (err) {
    console.error("Error during navigation or click:", err);
  }
  
  await browser.close();
})();
