const { Application } = require('spectron');

const main = async () => {
  app = new Application({
    path: './node_modules/.bin/electron',
    args: ['.'],
    startTimeout: 5000,
    host: process.env.CHROMEDRIVER_HOST || 'localhost',
    port: process.env.CHROMEDRIVER_PORT || 9515,
  });

  await app.start();
  await app.browserWindow.isVisible();
  const value = await app.client
    .getText('#value')
    .then(value => value)
    .then(val => val);
  console.log(value);
};

main();
