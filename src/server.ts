import app from "./app";
import config from "./config/config.env";
import { connectDB } from "./config/db";
import logger from "./config/logger";

const port = config.PORT;

connectDB();
app.listen(port, () => {
  logger.info(`App running on port: ${port}...`);
});
