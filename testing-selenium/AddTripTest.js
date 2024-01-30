const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build(); // or 'firefox', depending on your installed driver

  try {
    await driver.manage().window().maximize();
    await driver.get('https://pintrip-front.onrender.com/'); // Replace with your app's URL

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/nav/ul/li[2]/a')), 5000).click();

    const email = await driver.findElement(By.xpath('//*[@id="email"]'));
    await email.sendKeys('spiderman@web.com');

    const password = await driver.findElement(By.xpath('//*[@id="password"]'));
    await password.sendKeys('spiderman');

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/div/form/button')), 5000).click();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/nav/ul/li[3]/a')), 5000).click();

    const title = await driver.wait(until.elementLocated(By.id('title')), 5000);
    await title.sendKeys('Trip to Italy');

    const description = await driver.wait(until.elementLocated(By.id('description')), 5000);
    await description.sendKeys('Finally visited Italy');

    const location = await driver.wait(until.elementLocated(By.id('location')), 5000);
    await location.sendKeys('Rome, Italy');

    const image = await driver.findElement(By.xpath('//*[@id="root"]/main/form/div[4]/div/button'));

    const imagePath = '/Users/alminasehic/Documents/PINTRIP-SDP/frontend/src/photos/roma.png';

    await image.sendKeys(imagePath);

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/form/button')), 5000).click();

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/nav/ul/li[2]/a')), 5000).click();

    let element = await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/ul/li/div/div[3]/a')), 5000);

    console.log('Test passed');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
}

runTest();
