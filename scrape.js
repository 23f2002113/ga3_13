const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  // The seeds provided in the assignment
  const seeds = [84, 85, 86, 87, 88, 89, 90, 91, 92, 93];

  for (const seed of seeds) {
    const url = `https://21f1003117.github.io/scraping-seeds/seed/${seed}.html`;
    
    try {
      // Navigate and wait until the network is idle
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for at least one table to be visible
      await page.waitForSelector('table', { timeout: 5000 }).catch(() => null);

      // Extract all numbers from all table cells
      const pageNumbers = await page.$$eval('td', cells => {
        return cells.map(cell => {
          // Remove commas, whitespace, and non-numeric characters except decimals
          const text = cell.innerText.trim().replace(/,/g, '');
          const val = parseFloat(text);
          return isNaN(val) ? 0 : val;
        });
      });

      const pageSum = pageNumbers.reduce((acc, val) => acc + val, 0);
      grandTotal += pageSum;

      console.log(`Seed ${seed}: Page Sum = ${pageSum}`);
    } catch (error) {
      console.error(`Error processing Seed ${seed}: ${error.message}`);
    }
  }

  console.log(`Final Total Sum: ${grandTotal}`);
  await browser.close();
}

run();
