import cron from 'node-cron';

export const initCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    // Placeholder for future scheduled tasks (e.g. nightly cleanup or stale-order reminders).
  });
};
