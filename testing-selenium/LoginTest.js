const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build(); // or 'firefox', depending on your installed driver

  try {
    await driver.manage().window().maximize();
    await driver.get('http://localhost:3000/'); // Replace with your app's URL

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/nav/ul/li[2]/a')), 5000).click();

    const email = await driver.findElement(By.id('email'));
    await email.sendKeys('docstrange@gmail.com');

    const password = await driver.findElement(By.id('password'));
    await password.sendKeys('StrangeDoc');

    await driver.findElement(By.xpath('//*[@id="root"]/main/div/form/button')).click();

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/nav/ul/li[2]/a')), 5000);

    console.log('Test passed');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
}

runTest();
