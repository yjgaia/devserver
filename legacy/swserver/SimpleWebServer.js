let PORT = 8413;

let FS = require("fs");
let Path = require("path");

require("http").createServer((req, res) => {

	let url = req.url;
	if (url.indexOf("?") !== -1) {
		url = url.substring(0, url.indexOf("?"));
	}
	if (url === "/") {
		url = "/index.html";
	}

	let path = "./" + url;
	let extname = Path.extname(path);
	let contentType = "text/html";

	if (extname === ".js") {
		contentType = "application/javascript";
	} else if (extname === ".css") {
		contentType = "text/css";
	} else if (extname === ".jpg" || extname === ".jpeg") {
		contentType = "image/jpeg";
	} else if (extname === ".png") {
		contentType = "image/png";
	} else if (extname === ".ogg") {
		contentType = "audio/ogg";
	} else if (extname === ".mp3") {
		contentType = "audio/mpeg";
	} else if (extname === ".svg") {
		contentType = "image/svg+xml";
	}

	const serve404 = () => {
		FS.access("./404.html", (error) => {

			if (error === null) {
				FS.readFile("./404.html", "binary", (error, data) => {
					if (error === null) {
						res.writeHead(404, {
							"Content-Type": contentType
						});
						res.write(data, "binary");
						res.end();
					} else {
						res.writeHead(404, {
							"Content-Type": "text/plain"
						});
						res.write("404 Not Found.");
						res.end();
					}
				});
			}

			else {
				res.writeHead(404, {
					"Content-Type": "text/plain"
				});
				res.write("404 Not Found.");
				res.end();
			}
		});
	};

	FS.access(path, (error) => {

		if (error === null) {
			FS.readFile(path, "binary", (error, data) => {
				if (error === null) {
					res.writeHead(200, {
						"Content-Type": contentType
					});
					res.write(data, "binary");
					res.end();
				} else {
					res.writeHead(500, {
						"Content-Type": "text/plain"
					});
					res.write(error.toString());
					res.end();
				}
			});
		}

		else if (extname === "") {
			FS.access(path + ".html", (error) => {

				if (error === null) {
					FS.readFile(path + ".html", "binary", (error, data) => {
						if (error === null) {
							res.writeHead(200, {
								"Content-Type": contentType
							});
							res.write(data, "binary");
							res.end();
						} else {
							res.writeHead(500, {
								"Content-Type": "text/plain"
							});
							res.write(error.toString());
							res.end();
						}
					});
				}

				else {
					serve404();
				}
			});
		}

		else {
			serve404();
		}
	});

}).listen(PORT);

console.log("Started SimpleWebServer! http://localhost:" + PORT);
