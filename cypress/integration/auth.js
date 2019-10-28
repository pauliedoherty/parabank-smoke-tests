describe('Auth', function() {
  beforeEach(() => {
    cy.visit('/'); // visit baseUrl
  })
  after(() => {
    cy.clearCookies();
  }); 
  it('Checks valid user can login', function() {
    cy.fixture('logins.json').then((user) => {
      cy.loginUI(user.myAccount);
    })
  });

  it('Checks wrong credentials cannot login', function() {
    cy.get('form').within(() => {
      cy.get('.button').click();
    });
    cy.get('.title').should('have.text', 'Error!');
  });

  // it('Checks correct account is loaded', function() {
      // I removed this test because there were cases logging in would navigate to a different
  // });
});