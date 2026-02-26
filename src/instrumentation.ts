export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const cron = await import("node-cron");
    const { fetchAllDeals } = await import("@/services/deal-fetcher");
    const { sendKeywordNotifications } = await import("@/services/notifications");

    const schedule = process.env.CRON_SCHEDULE || "0 * * * *";

    cron.default.schedule(schedule, async () => {
      console.log(`[LocalSteals] Fetching deals at ${new Date().toISOString()}`);
      try {
        const result = await fetchAllDeals();
        console.log(`[LocalSteals] Found ${result.newDeals} new deals`);

        if (result.matched.length > 0) {
          console.log(`[LocalSteals] Keyword matches: ${result.matched.join(", ")}`);
          await sendKeywordNotifications(result.matched);
        }
      } catch (error) {
        console.error("[LocalSteals] Deal fetch failed:", error);
      }
    });

    console.log(`[LocalSteals] Cron job scheduled: ${schedule}`);

    // Run initial fetch 5 seconds after startup
    setTimeout(async () => {
      console.log("[LocalSteals] Running initial deal fetch...");
      try {
        const result = await fetchAllDeals();
        console.log(`[LocalSteals] Initial fetch: ${result.newDeals} new deals`);
      } catch (error) {
        console.error("[LocalSteals] Initial fetch failed:", error);
      }
    }, 5000);
  }
}
