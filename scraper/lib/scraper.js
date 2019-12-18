const scraper = async ({ page, url, selectors }) => {
  let result;
  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    result = await page.evaluate(selectors => {
      const headline = document.querySelector(selectors.headline);
      const total_review = document.querySelector(selectors.total_review);
      const last_review_date = document.querySelector(
        selectors.last_review_date
      );
      const description = document.querySelector(selectors.description);

      return {
        headline: headline.innerText,
        total_review: total_review.innerText.split(" ")[0],
        last_review_date: last_review_date.innerText,
        description: description.innerText
      };
    }, selectors);
  } catch (error) {
    throw error;
  }
  return result;
};

module.exports = scraper;
