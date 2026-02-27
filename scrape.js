const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  const seeds = [84, 85, 86, 87, 88, 89, 90, 91, 92, 93];

  for (const seed of seeds) {
    // NEW URL STRUCTURE
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    
    try {
      console.log(`Visiting: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // IMPORTANT: Wait for the table cells to actually load in the browser
      await page.waitForSelector('td', { timeout: 10000 });

      // Extract all numbers from the table
      const pageSum = await page.$$eval('td', cells => {
        return cells
          .map(cell => cell.innerText.trim().replace(/,/g, '')) // Remove commas
          .filter(text => text !== "" && !isNaN(text))        // Keep only valid numbers
          .reduce((acc, val) => acc + parseFloat(val), 0);     // Sum them up
      });

      grandTotal += pageSum;
      console.log(`Seed ${seed}: Page Sum = ${pageSum}`);
    } catch (error) {
      console.error(`Error on Seed ${seed}: ${error.message}`);
    }
  }

  // The total that must appear in your logs
  console.log(`Final Total Sum: ${grandTotal}`);
  await browser.close();
}

run();