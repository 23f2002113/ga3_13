const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  const seeds = [84, 85, 86, 87, 88, 89, 90, 91, 92, 93];

  for (const seed of seeds) {
    // UPDATED URL: Changed from /seed/${seed} to /seed${seed}
    const url = `https://21f1003117.github.io/scraping-seeds/seed${seed}.html`;
    
    try {
      console.log(`Visiting: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Extract all numbers from all table cells
      const pageNumbers = await page.$$eval('table td', (cells) => {
        return cells.map(cell => {
          // Find all numbers (including decimals) in the text
          const matches = cell.innerText.match(/[-+]?[0-9]*\.?[0-9]+/g);
          if (matches) {
            // Sum all numbers found within a single cell
            return matches.reduce((sum, val) => sum + parseFloat(val), 0);
          }
          return 0;
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