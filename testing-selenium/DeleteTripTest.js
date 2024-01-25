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

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/ul/li/div/div[3]/button')), 5000).click();

    let element = await driver.wait(until.elementLocated(By.xpath('//*[@id="modal-hook"]/div/header/h2')), 10000);
    let text = await element.getText();

    if (text === 'Are you sure?') {
      console.log('Text matches.');
    } else {
      console.log(`Text is "${text}". Test failed.`);
    }
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
}

runTest();
