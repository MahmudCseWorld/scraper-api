

const scraper = async (page) => {
  
  await page.goto('https://example.com');


  const result = await page.evaluate(() => {
    return {
      header: document.querySelector('h1').innerText,
      title: document.querySelector('div p').innerText 
    };
  });
  console.log(result); 
  return result; 
};

module.exports = scraper;