import { program } from "commander";
import Config from "./Config.js";
import FileServer from "./FileServer.js";

export default async function run(config: Config) {
  const options = program.option(
    "-p, --port <port>",
    "Port to listen on",
    `${config.webServerPort}`,
  ).parse().opts<{ port: string }>();

  config.webServerPort = parseInt(options.port);
  new FileServer(config);
}
