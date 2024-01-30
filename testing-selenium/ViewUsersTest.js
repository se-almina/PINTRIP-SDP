const { Builder, By, until } = require('selenium-webdriver');
const { elementIsNotVisible } = require('selenium-webdriver/lib/until');

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build(); // or 'firefox', depending on your installed driver

  try {
    await driver.manage().window().maximize();
    await driver.get('https://pintrip-front.onrender.com/'); // Replace with your app's URL

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/nav/ul/li[2]/a')), 5000).click();

    const email = await driver.findElement(By.xpath('//*[@id="email"]'));
    await email.sendKeys('batman@web.com');

    const password = await driver.findElement(By.xpath('//*[@id="password"]'));
    await password.sendKeys('batman');

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/div/form/button')), 5000).click();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/ul/li[1]/div/a')), 5000).click();

    if (elementIsNotVisible(By.className('button button--default undefined button--danger'), 5000)) {
      console.log('Test passed.');
    } else {
      console.log(`Test failed.`);
    }
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
}

runTest();
