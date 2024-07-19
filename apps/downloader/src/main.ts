import { job } from './job';

// let isRunning = false;
// setInterval(async () => {
//   if (isRunning) {
//     return;
//   }

//   try {
//     isRunning = true;
//     await job.run();
//   } catch (error) {
//     console.error('Error running downloader job', error);
//   } finally {
//     isRunning = false;
//   }
// }, 1000 * 60 * 1);

// console.log('Cron job configured!');

const run = async () => {
  await job.run();
};

run();
