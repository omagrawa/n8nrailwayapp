const puppeteer = require('/usr/local/lib/node_modules/puppeteer-extra');
const StealthPlugin = require('/usr/local/lib/node_modules/puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    dumpio: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-gl-drawing-for-tests',
      '--no-zygote',
      '--single-process',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-sync',
      '--mute-audio',
      '--use-gl=swiftshader'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Login
  await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' });

  const EMAIL = "om.agrawal9415@gmail.com";
  const PASSWORD = "omagrawal007"

  await page.type('#email', EMAIL, { delay: 100 });
  await page.type('#pass', PASSWORD, { delay: 100 });
  await Promise.all([
    page.click('[name="login"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  // Optional: save cookies
  const cookies = await page.cookies();
  fs.writeFileSync('/scripts/cookies.json', JSON.stringify(cookies, null, 2));

  // Go to profile page
  await page.goto('https://www.facebook.com/me', { waitUntil: 'networkidle2' });

  // Wait and scroll to load more posts
  let previousHeight = 0;
  for (let i = 0; i < 5; i++) {
    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const newHeight = await page.evaluate('document.body.scrollHeight');
    if (newHeight === previousHeight) break;
  }

  // Extract visible post texts
  const posts = await page.evaluate(() => {
  const elements = document.querySelectorAll('div[data-ad-preview="message"], div[role="article"] span');
  return Array.from(elements)
    .map(el => el.innerText.trim())
    .filter(Boolean);
});


  console.log(JSON.stringify({
    status: 'ok',
    postCount: posts.length,
    posts: posts.slice(0, 5)
  }, null, 2));

  await browser.close();
})();
