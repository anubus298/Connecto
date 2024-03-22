describe("passwordReset", () => {
  const test_email = Cypress.env("TEST_USER_EMAIL") as string;
  const test_password = Cypress.env("TEST_USER_PASSWORD") as string;

  it("it go to password reset page and type the email successfully", () => {
    cy.visit("/");
    cy.get("[data-cy='password-reset-button']").click();
    cy.wait(3000);
    cy.get('input[name="email"]').type(test_email);
    cy.get('[data-cy="submit-button"]').click();
    cy.get("[data-cy-error='false']").should("exist");
  });
});
