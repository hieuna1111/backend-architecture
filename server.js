const app = require('./src/app');
const { stopMonitoring } = require('./src//helpers/check.connect');

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`);
});

process.on('SIGTERM', () => {
  if (server) {
    server.close(() => {
      // if (1 === 1) {
      //   stopMonitoring();
      //   console.log(`Clear intervals check overload database success.`);
      // }
      console.log(`Exit Server Express`);
    });
    // notify.send(...ping);
  }
});
