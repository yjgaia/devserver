import {
  content_types,
  FileUtils,
  HttpContext,
  WebServer,
  WebServerOptions,
} from "@common-module/server";
import * as Path from "path";

export default class FileServer extends WebServer {
  public static contentTypeFromPath(path: string): string {
    const extension = Path.extname(path).substring(1);
    const contentType = (content_types as any)[extension];
    return contentType === undefined ? "application/octet-stream" : contentType;
  }

  private publicFolderPath: string = ".";

  constructor(options: WebServerOptions) {
    super(options, async (context) => {
      const filename = Path.basename(context.uri);
      if (filename.startsWith(".")) {
        console.log(
          `WARNING: ${context.ip} tried to access a hidden file: ${filename}`,
        );
        await context.response({
          statusCode: 403,
          content:
            `WARNING: Your IP address ${context.ip} has been logged and reported for suspicious activity. Any further attempts to breach our security will be met with serious legal consequences. Please cease and desist immediately.`,
        });
      } else if (context.uri.includes("..") === true) {
        console.log(
          `WARNING: ${context.ip} tried to access a file outside of the public folder.`,
        );
        await context.response({
          statusCode: 403,
          content:
            `WARNING: Your IP address ${context.ip} has been logged and reported for suspicious activity. Any further attempts to breach our security will be met with serious legal consequences. Please cease and desist immediately.`,
        });
      } else if (context.headers.range !== undefined) {
        await this.responseStream(context);
      } else if (context.method === "GET") {
        await this.responseResource(context);
      }
    });
  }

  private async responseStream(context: HttpContext) {
    //TODO:
  }

  protected modifyIndexFileContent(content: string): string {
    return content;
  }

  private async responseResource(context: HttpContext) {
    try {
      const contentType = FileServer.contentTypeFromPath(context.uri);
      const content = await FileUtils.readBuffer(
        `${this.publicFolderPath}/${context.uri}`,
      );
      await context.response({ content, contentType });
    } catch (error) {
      try {
        const indexFileContent = await FileUtils.readText(
          `${this.publicFolderPath}/index-dev.html`,
        );
        await context.response({
          content: this.modifyIndexFileContent(indexFileContent),
          contentType: "text/html",
        });
      } catch (error) {
        try {
          const indexFileContent = await FileUtils.readText(
            `${this.publicFolderPath}/index.html`,
          );
          await context.response({
            content: this.modifyIndexFileContent(indexFileContent),
            contentType: "text/html",
          });
        } catch (error) {
          await context.response({ statusCode: 404 });
        }
      }
    }
  }
}
