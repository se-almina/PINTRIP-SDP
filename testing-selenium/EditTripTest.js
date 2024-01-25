const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build(); // or 'firefox', depending on your installed driver

  try {
    await driver.manage().window().maximize();
    await driver.get('http://localhost:3000/'); // Replace with your app's URL

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/nav/ul/li[2]/a')), 5000).click();

    const email = await driver.findElement(By.xpath('//*[@id="email"]'));
    await email.sendKeys('spiderman@web.com');

    const password = await driver.findElement(By.xpath('//*[@id="password"]'));
    await password.sendKeys('spiderman');

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/div/form/button')), 5000).click(); //login

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/ul/li[1]/div/a')), 5000).click();

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/ul/li/div/div[3]/a')), 5000).click();

    const title = await driver.wait(until.elementLocated(By.id('title')), 5000);
    await title.sendKeys('!!!!');

    const description = await driver.wait(until.elementLocated(By.id('description')), 5000);
    await description.sendKeys('!!!!');

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/form/button')), 5000).click();

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/ul/li/div/div[3]/button')), 5000);

    console.log('Test passed');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
}

runTest();
