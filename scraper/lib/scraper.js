
const scraper = async ({ page, url, roomId, selector }) => {
  console.log(`scraper: ${roomId}`);
  let result;
  try {
    // Block images to speeup pages
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
        req.abort();
      }
      else {
        req.continue();
      }
    });
    console.log(`Navigating`)
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log(`Extracting`);
    result = await page.evaluate(selector => {
      const headline = document.querySelector(selector.headline);
      const total_review = document.querySelector(selector.total_review);
      const last_review_date = document.querySelector(
        selector.last_review_date
      );
      const description = document.querySelector(selector.description);

      return {
        headline: headline.innerText,
        description: description && description.innerText,
        total_review: total_review && total_review.innerText.split(" ")[0],
        last_review_date: last_review_date && last_review_date.innerText,
      };
    }, selector);
  } catch (error) {
    throw error;
  }
  return result;
};

module.exports = scraper;