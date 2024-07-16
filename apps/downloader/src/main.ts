import { job } from './job';

console.log('Cron job started!...');

setInterval(async () => {
  try {
    await job.run();
  } catch (error) {
    console.error('Error running downloader job', error);
  }
}, 1000 * 60 * 1);
