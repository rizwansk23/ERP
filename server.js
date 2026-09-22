import 'dotenv/config';
import app from './src/app.js';
import config from './src/config/app.config.js';

app.listen(config.port, () => {
  console.log(`Server running on port 'http://localhost:${config.port}'`);
  console.log(`api documentation on port 'http://localhost:${config.port}/docs'`);
});
