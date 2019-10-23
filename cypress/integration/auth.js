describe('Auth', function() {
  beforeEach(() => {
    cy.visit('/'); // visit baseUrl
  })
  it('Checks valid user can login', function() {
    cy.fixture('logins.json').then((user) => {
      cy.get('form').within(() => {
        cy.get('input[name="username"]').type(`${user.username}`);
        cy.get('input[name="password"]').type(`${user.password}`);
        cy.get('.button').click();
        cy.url().should('eq', 'https://parabank.parasoft.com/parabank/overview.htm');
      });
    })
  });

  it('Checks wrong credentials cannot login', function() {

  });

  it('Checks correct account is loaded', function() {

  });
});