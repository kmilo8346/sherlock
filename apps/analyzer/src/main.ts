import { job } from './Job';

console.log('Cron job started!...');

setInterval(async () => {
  try {
    await job.run();
  } catch (error) {
    console.error('Error running analyzer job', error);
  }
}, 1000 * 60 * 1);
