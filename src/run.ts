import Config from "./Config.js";
import FileServer from "./FileServer.js";

export default async function run(config: Config) {
  new FileServer(config);
  console.log(`Started Dev Server! http://localhost:${config.webServerPort}`);
}
