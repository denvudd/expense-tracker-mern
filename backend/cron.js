import cron from "cron";
import https from "https";

const URL = `https://expense-tracker-mern-c3q5.onrender.com`;

const cronJob = new cron.CronJob("*/14 * * * *", async () => {
  https
    .get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request successful");
      } else {
        console.log("GET request failed", res.statusCode);
      }
    })
    .on("error", (error) => {
      console.error("Error while sending GET request:", error);
    });
});

export default cronJob;
