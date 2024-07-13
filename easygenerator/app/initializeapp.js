import { createServer } from "http";
import { readFileSync } from "fs";

const fileContent = readFileSync("task.html");
const server = createServer((req, res) => {
	res.writeHead(200, { "Content-type": "text/html" });
	res.end(fileContent);
});

server.listen(5001, "127.0.0.1", () => {
	console.log("Application running on http://127.0.0.1:5001");
});
