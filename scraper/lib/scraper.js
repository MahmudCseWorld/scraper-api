const scraper = async ({ page, url, selector }) => {
  let result;
  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    result = await page.evaluate(selector => {
      const headline = document.querySelector(selector.headline);
      const total_review = document.querySelector(selector.total_review);
      const last_review_date = document.querySelector(
        selector.last_review_date
      );
      const description = document.querySelector(selector.description);

      return {
        headline: headline.innerText,
        total_review: total_review.innerText.split(" ")[0],
        last_review_date: last_review_date.innerText,
        description: description.innerText
      };
    }, selector);
  } catch (error) {
    throw error;
  }
  return result;
};

module.exports = scraper;