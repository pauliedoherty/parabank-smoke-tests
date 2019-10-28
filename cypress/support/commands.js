Cypress.Commands.add("loginUI", (user) => {
  cy.get('form').within(() => {
    cy.get('input[name="username"]').type(`${user.username}`);
    cy.get('input[name="password"]').type(`${user.password}`);
    cy.get('.button').click();
    cy.wait(1000);
  });
});

Cypress.Commands.add("checkLatestAccount", (latestAccount) => {
  cy.get('[id="leftPanel"]').contains('Accounts Overview').click();
  cy.wait(1000);
  cy.get('div[id="rightPanel"]').contains('Accounts Overview');
  cy.get('table[id="accountTable"] tr').eq(-3).should('contain', latestAccount); 
  cy.get('table[id="accountTable"] tr').eq(-3).contains(latestAccount).click();
  cy.wait(1000);
  cy.log('Check Account URL')
  cy.url().should('eq', 'https://parabank.parasoft.com/parabank/activity.htm?id=' + latestAccount);
  cy.log('Check correct account loaded in Account Details form');
  cy.get('table').contains('td[id="accountId"]', latestAccount);  
});  
