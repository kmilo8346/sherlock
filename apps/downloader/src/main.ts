import { job } from './job';

setInterval(async () => {
  try {
    await job.run();
  } catch (error) {
    console.error('Error running downloader job', error);
  }
}, 1000 * 60 * 1);

console.log('Cron job configured!');
