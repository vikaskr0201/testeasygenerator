/// <reference types="Cypress" />

const appiFrame = "#courses-iframe";
const tryNowButton = ".cta [href='https://live.easygenerator.com/signup']";

class iFrame {
	getIframe() {
		return cy.iframe(appiFrame);
		//from custom commands
	}

	tryNow() {
		return tryNowButton;
	}
}
export { iFrame };
