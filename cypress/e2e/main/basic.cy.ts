const login = () => {
  cy.session("cook", () => {
    cy.visit("/");
    cy.get('input[name="email"]').type("gg@gmail.com");
    cy.get('input[type="password"]').type("987612345saf");
    cy.get("button").contains("Sign In").click();
    cy.wait(5000);
    //check if username not null
    cy.get(".flex.items-center.gap-2")
      .find('a.font-semibold[href="/home/profile"]')
      .should("not.have.text", "");
  });
};
describe("basic features : login/text post /sign out", () => {
  beforeEach(" login and redirecting to /home", () => {
    if (!Cypress.currentTest.title.includes("-l")) {
      login();
      cy.visit("/home");
    }
  });
  it("post something and check if it exists in the profile page", () => {
    cy.get('textarea.rc-textarea[name="content"').type(
      "hi this is a test post"
    );
    cy.get("button.ant-btn.css-1d2z4u5.ant-btn-primary").click();
    cy.visit("/home/profile");
    cy.get("article")
      .first()
      .find("p.whitespace-pre-line")
      .should("have.text", "hi this is a test post");
  });
  it("delete a post and check if it is deleted", () => {
    cy.visit("/home/profile");
    cy.get("article").first().find("button.ant-dropdown-trigger").click();

    cy.contains("li.ant-dropdown-menu-item", "Delete").click();
    cy.contains("button.ant-btn", "OK").click();
    cy.wait(1500);
    cy.reload();
    //check if it is deleted

    cy.get("article")
      .first()
      .find("p.whitespace-pre-line")
      .then(($element) => {
        if ($element.length === 0) {
          return;
        }
        // Element exists, check its content
        expect($element.text()).not.to.contain("hi this is a test post");
      });
  });
  it("redirect to login page after clicking on login out", () => {
    cy.get(".flex.items-center.gap-2")
      .first()
      .find("button.ant-dropdown-trigger")
      .click();
    cy.contains("li.ant-dropdown-menu-item", "Sign out").click();
    cy.contains("button.ant-btn", "OK").click();
    cy.get('img[alt="cat"]').should("exist");
  });
  it("-l show login error for invalid credentials", () => {
    cy.visit("/");
    cy.get('input[name="email"]').type("testt@gmail.com");
    cy.get('input[type="password"]').type("wrongpass");
    cy.get("button").contains("Sign In").click();
    //check the msg
    cy.contains("p", "Invalid Password").should("exist");
  });
  it("-l restrict access to some pages without login", () => {});
});
