const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const filePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  
  // Find out what element is at the center of the screen
  const topElement = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    return el ? (el.id || el.className || el.tagName) : 'null';
  });
  console.log("Element at center:", topElement);
  
  // Try to find the VÀO KÈO NGAY button and click it with mouse
  const btnInfo = await page.evaluate(() => {
    const btn = document.getElementById('openBetModalBtn');
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
  
  if (btnInfo) {
    console.log("Button center:", btnInfo);
    const topAtBtn = await page.evaluate((x, y) => {
      const el = document.elementFromPoint(x, y);
      return el ? (el.id || el.className || el.tagName) : 'null';
    }, btnInfo.x, btnInfo.y);
    console.log("Element at button position:", topAtBtn);
  }
  
  await browser.close();
})();
