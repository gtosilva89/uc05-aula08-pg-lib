import { app } from "./app";

(async () => {
  try {
    app.configure();
    app.start();
  } catch (error) {
    console.log(error);
  } finally {
    app.stop();
  }
})();
