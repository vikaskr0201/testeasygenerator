import { LandingPage } from "../pageobject/landingpage";
import { iFrame } from "../support/common";

const landingpage = new LandingPage();
const iframe= new iFrame()
let mouseHoverOptions = ["Top", "Reload"];


beforeEach(() => {
	cy.fixture("testdata.json").as("testdata");
	cy.visit("/");
});

describe("Visit the localhost", () => {
	it("Logo is visible on the landing page", function () {
		landingpage.elements.egLogo().should("be.visible");
	});
});

describe("Header of the webpage", ()=>{
	it("EG logo is functional and on click navigates to website", function(){
		landingpage.clickOnLogo();
		cy.url().should("include", this.testdata.url);
	});

	it("Home button is visible and on click navigates to website", function(){
		landingpage.elements.homeButton().should("be.visible");
		landingpage.clickOnHomeButton();
		cy.url().should("include", this.testdata.url);
	});
});

describe("Validating dropdown", () => {
	it("Selecting an option from dropdown and validating option is selected", function() {
		const dropdown = this.testdata;
		landingpage.selectOptionFromDropdown(dropdown.dropdownOption);
		landingpage.elements.dropdown().should("have.value", dropdown.dropdownValue)

	});
});

describe("Image upload", () => {
	it("Validating a .PNG uploaded successfully", function() {

		cy.fixture("samplepngimage.png", null).as("image");
		landingpage.elements.imageUpload().selectFile("@image");
		landingpage.elements.uploadedImage().should("be.visible");
	});

	it("Validating a .JPEG uploaded successfully", function() {

		cy.fixture("samplejpegimage.jpeg", null).as("image");
		landingpage.elements.imageUpload().selectFile("@image");
		landingpage.elements.uploadedImage().should("be.visible");
	});
});

describe("Open new tab", () => {
	it("Validating clicking on open new tab and its functionality", function () {
		cy.window().then((win) => {
			cy.stub(win, "open").as("openNewTab");
		});
		landingpage.elements.openNewTab().click();
		cy.get("@openNewTab").should("have.been.calledOnceWithExactly", "https://easygenerator.com", "_blank");
	});
});

describe("Alert confirmation modal", () => {
	it("Enter name, click alert and verify the alert", function () {
		const data = this.testdata;
		const stub = cy.stub();
		cy.on("window:alert", stub);
		cy.task("readFile", data.alertFile).then((text: string) => {
			landingpage.enterName(text);
		});
		landingpage.clickAlert().then(() => {
			expect(stub.getCall(0)).to.be.calledWith(data.alertText);
		});
	});
	it("Enter name, click confirm and then cancel from confirm box", function () {
		const data = this.testdata;
		const stub = cy.stub();
		cy.on("window:confirm", stub);
		cy.task("readFile", data.alertFile).then((text: string) => {
			landingpage.enterName(text);
		});
		landingpage.clickConfirm().then(() => {
			expect(stub.getCall(0)).to.be.calledWith(data.confirmAlert);
		});
	});

});

describe("Show/Hide Functionality", () => {
	it("Default Text box is visible", function () {
		landingpage.elements.textBox().should("be.visible");
	});

	it("Click on hide and verify the text box is hidden", function () {
		landingpage.clickHideTextBoxButton();
		landingpage.elements.textBox().should("not.be.visible");
	});

	it("Click on show and verify the text box is visible", function () {
		landingpage.clickShowTextBoxButton();
		landingpage.elements.textBox().should("be.visible");
	});

	it("Input text in the text box, hide and show to validate the text is present ", function () {
		landingpage.inputText(this.testdata.alertText);
		landingpage.clickHideTextBoxButton();
		landingpage.clickShowTextBoxButton();
		landingpage.elements
			.textBox()
			.invoke("val")
			.then((value: string) => {
				expect(value).to.eq(this.testdata.alertText);
			});
	});
});

describe("Mouse Hover Functionality", () => {

	it("Mouse Hover depicting dropdown options", function () {
		landingpage.hoverMouseOverButton();
		landingpage.elements.onHoverDropdown().should("be.visible");
		landingpage.elements.onHoverDropdownOptions().each((option, index) => {
			const value = option.text();
			expect(value).to.equal(mouseHoverOptions[index]);
		});
	});

	it("Click Top and verify it scrolls to the top of the page", function () {
		landingpage.hoverMouseOverButton();
		landingpage.elements.onHoverDropdown().should("be.visible");
		landingpage.elements.onHoverDropdownOptions().contains(mouseHoverOptions[0]).click();
		cy.window().its("scrollY").should("equal", 0);
	});

	it("Click Reload and verify it scrolls to the top of the page", function () {
		cy.window().then((win: any) => {
			win.beforeReload = true;
		});
		cy.window().should("have.prop", "beforeReload", true);
		landingpage.hoverMouseOverButton();
		landingpage.elements.onHoverDropdown().should("be.visible");
		landingpage.elements.onHoverDropdownOptions().contains(mouseHoverOptions[1]).click();
		cy.window().should("not.have.prop", "beforeReload");
		cy.window().its("scrollY").should("equal", 0);
	});
});

describe("Footer Social Media Links", () => {
	it("Social media links are functional", function () {
		landingpage.elements.socialMediaLinks().each((link, index) => {
			landingpage.elements.socialMediaLinks().eq(index).then((link) => {
				cy.request(link.prop('href'))
			})	
		})
	});
});

describe("iFrame", () => {
	beforeEach(() => {
		cy.fixture("mockAPI.json").as("mockResponse");
	});
	it("Click on Try now for free and mock the API response", function () {
		cy.intercept("GET", "**/auth-pages-settings", { fixture: "mockAPI.json", statusCode: 404 }).as(
			"authPagesAPI"
		);
		iframe.getIframe().find(iframe.tryNow()).click({ force: true });
		cy.wait("@authPagesAPI");
	});
});