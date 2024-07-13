import { defineConfig } from "cypress";
import fs from "fs"

export default defineConfig({
  e2e: {
	specPattern: '**/e2e/*.cy.ts',
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
