Cypress.Commands.add("loginUI", (user) => {
  cy.get('form').within(() => {
    cy.get('input[name="username"]').type(`${user.username}`);
    cy.get('input[name="password"]').type(`${user.password}`);
    cy.get('.button').click();
  });
});

