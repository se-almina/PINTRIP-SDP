const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build(); // or 'firefox', depending on your installed driver

  try {
    await driver.manage().window().maximize();
    await driver.get('https://pintrip-front.onrender.com/'); // Replace with your app's URL

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/header/nav/ul/li[2]/a')), 5000).click();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/main/div/button')), 5000).click();

    const name = await driver.findElement(By.xpath('//*[@id="name"]'));
    await name.sendKeys('Doctor Strange');

    const image = await driver.findElement(By.xpath('/html/body/div[4]/main/div/form/div[2]/div/button'));

    const imagePath = '/Users/alminasehic/Documents/PINTRIP-SDP/frontend/src/photos/doc.png';

    await image.sendKeys(imagePath);

    const email = await driver.findElement(By.xpath('//*[@id="email"]'));
    await email.sendKeys('docstrange@gmail.com');

    const password = await driver.findElement(By.xpath('/html/body/div[4]/main/div/form/div[4]/input'));
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
