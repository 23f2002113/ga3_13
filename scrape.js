const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  // Iterate through Seeds 84 to 93
  for (let i = 84; i <= 93; i++) {
    const url = `https://21f1003117.github.io/scraping-seeds/seed/${i}.html`;
    try {
      await page.goto(url);
      
      // Select all cells in all tables and parse numbers
      const pageSum = await page.$$eval('table td', cells => {
        return cells
          .map(cell => cell.innerText.trim().replace(/,/g, '')) // Remove commas
          .filter(text => text.length > 0 && !isNaN(text))      // Filter valid numbers
          .reduce((acc, val) => acc + parseFloat(val), 0);     // Sum
      });

      grandTotal += pageSum;
      console.log(`Seed ${i}: Page Sum = ${pageSum}`);
    } catch (error) {
      console.error(`Could not scrape Seed ${i}: ${error.message}`);
    }
  }

  console.log(`Final Total Sum: ${grandTotal}`);
  await browser.close();
}

run();
