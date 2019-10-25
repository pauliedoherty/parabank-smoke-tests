describe('Auth', function() {
  before(() => {
    cy.visit('/'); // visit baseUrl
  })
  it('Checks valid user can login', function() {
    cy.fixture('logins.json').then((user) => {
      cy.loginUI(user.validUser);
    })
  });

  it('Checks wrong credentials cannot login', function() {
    cy.url().should('eq', 'https://parabank.parasoft.com/parabank/overview.htm');
  });

  it('Checks correct account is loaded', function() {
    cy.url().should('eq', 'https://parabank.parasoft.com/parabank/overview.htm');
  });
});