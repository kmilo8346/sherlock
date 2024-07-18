import { job } from './Job';

let isRunning = false;
setInterval(async () => {
  // Evito que se ejecute el job
  // si ya está corriendo
  if (isRunning) {
    return;
  }

  try {
    isRunning = true;
    await job.run();
  } catch (error) {
    console.error('Error running analyzer job', error);
  } finally {
    isRunning = false;
  }
}, 1000 * 60 * 1);

console.log('Cron job configured!');
