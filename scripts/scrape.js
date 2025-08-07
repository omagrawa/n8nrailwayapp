const puppeteer = require("/usr/local/lib/node_modules/puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // run in background
    executablePath: "/usr/bin/chromium-browser", // system chromium
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  });

  const page = await browser.newPage();

  // 1. Set a user-agent (looks more like a real browser)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // 2. Go to website
  await page.goto("https://news.ycombinator.com", {
    waitUntil: "domcontentloaded",
    timeout: 60000
  });

  // 3. Wait for content (best practice: use selectors, not timeouts)
  await page.waitForSelector(".athing");

  // 4. Extract structured data
  const articles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".athing")).map(article => ({
      title: article.querySelector(".titleline a")?.innerText.trim(),
      link: article.querySelector(".titleline a")?.href
    }));
  });

  // 5. Output as JSON
  console.log(JSON.stringify(articles, null, 2));

  await browser.close();
})();
