const { defineConfig } = require("cypress");
import fs from "fs"

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
				readFile(filename) {
					if (fs.existsSync(filename)) {
						return fs.readFileSync(filename, "utf8");
					}

					return null;
				}
			});
    },
    baseUrl: "http://localhost:5001/",
		chromeWebSecurity: false,
  }
});
