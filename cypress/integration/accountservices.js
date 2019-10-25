describe('Auth', function() {
  before(() => {
    // Cypress.Cookies.debug(true)
    Cypress.Cookies.preserveOnce('JSESSIONID', '__cfduid');
    cy.visit('/'); 
    cy.wait(500);
    cy.fixture('logins.json').then((user) => {
      cy.loginUI(user.myAccount);
    })
  });
  beforeEach(function() {
    Cypress.Cookies.preserveOnce('JSESSIONID', '__cfduid');
    // cy.restoreLocalStorageCache();
    cy.contains('Open New Account').click();  //revisit because of contains
    cy.wait(1000);
  });
  // afterEach(() => {
  //   // cy.saveLocalStorageCache();
  // });


  it('Checks URL is correct on Open New Account page', function() {
    cy.url().should('eq', 'https://parabank.parasoft.com/parabank/openaccount.htm')
  });

  it('Open Account - Checking account withdrawal', function() {
    cy.get('select[id="type"]').select('CHECKING');
    cy.get('input[type="submit"]').click();
    cy.wait(3000);
    cy.get('.title').should('have.text', 'Account Opened!'); //REVISITMaybe use show result tag div[ng-if="showResult"]
  });
});
