import { updateFunds, dollarFormat, getAccountsData } from '../support/utils.js';
import { amount } from '../support/utils.js';

describe('Open new account', function() {
  let accounts = [];  //hold account data

  before(() => {
    cy.visit('/'); 
    cy.wait(500);
    cy.fixture('logins.json').then((user) => {
      cy.loginUI(user.myAccount);
    });
  });

  beforeEach(function() {
    Cypress.Cookies.preserveOnce('JSESSIONID', '__cfduid');
    cy.visit('/'); 
    cy.get('[id="leftPanel"]').contains('Accounts Overview').click();
    cy.wait(2000); //wait for data to load othewise only table outline is included
    cy.get('table[id="accountTable"]').then(($el) => {
      accounts = getAccountsData($el);  //get accounts overview data
    });
    cy.get('[id="leftPanel"]').contains('Open New Account').click(); 
    cy.wait(1000);
  });

  after(() => {
    cy.clearCookies();
  }); 

  it('Check Open New Account page opens', function() {
    cy.url().should('eq', 'https://parabank.parasoft.com/parabank/openaccount.htm');
    cy.get('[id="rightPanel"] .title').should('have.text', 'Open New Account');
  });

  it('Open new account from Checkings\' account', function() {
    cy.get('select[id="type"]').select('CHECKING');
    cy.get('select[id="fromAccountId"]')
      .select(accounts[accounts.length-3]['Account']); //always select latest account
    cy.get('input[type="submit"]').click();
    cy.wait(1000);
    cy.get('[ng-if="showResult"] .title').should('have.text', 'Account Opened!'); 
    cy.get('a[id="newAccountId"]').then(($a) => {
      const newAccount = parseInt($a.text());
      cy.checkLatestAccount(newAccount);
    });
  });

  it('Open new account from Savings\' account', function() {
    cy.get('select[id="type"]').select('SAVINGS');
    cy.get('select[id="fromAccountId"]')
      .select(accounts[accounts.length-3]['Account']);
    cy.get('input[type="submit"]').click();
    cy.wait(1000);
    cy.get('[ng-if="showResult"] .title').should('have.text', 'Account Opened!'); 
    cy.get('a[id="newAccountId"]').then(($a) => {
      const newAccount = parseInt($a.text());
      cy.checkLatestAccount(newAccount);
    });
  });
});

describe('Transfer Funds', function() { 
  let accounts = [];
  // const amount = 100.05;  //amount to transfer

  before(() => {
    cy.visit('/'); 
    cy.wait(500);
    cy.fixture('logins.json').then((user) => {
      cy.loginUI(user.myAccount); 
    });
  });
  beforeEach(function() {
    Cypress.Cookies.preserveOnce('JSESSIONID', '__cfduid');
    cy.get('[id="leftPanel"]').contains('Accounts Overview').click();
    cy.wait(1500)
    cy.get('table[id="accountTable"]').then(($el) => {
      accounts = getAccountsData($el);
    });
    cy.get('[id="leftPanel"]').contains('Transfer Funds').click();  //revisit because of contains
    cy.wait(1000);
  });
  after(() => {
    cy.clearCookies();
  }); 

  it('Check Transfer Funds page opens', () => {
    cy.url().should('eq', 'https://parabank.parasoft.com/parabank/transfer.htm');
    cy.get('[id="rightPanel"] .title').should('have.text', 'Transfer Funds');
  });

  it('Transfers funds between 2 accounts and checks if balances have been updated', () => {    
    var fromIndex;
    accounts.length < 4 ? fromIndex = 3 : fromIndex = 4;   // gaurd against event that there's on account
    var fromAccount = accounts[accounts.length - 3];       // always transfer from latest account
    var toAccount = accounts[accounts.length - fromIndex]; // to second latest if there's > 1
    
    cy.get('input[id="amount"]').type(amount);
    cy.get('select[id="fromAccountId"]').select(fromAccount['Account']);
    cy.get('select[id="toAccountId"]').select(toAccount['Account']);
    cy.get('input[type="submit"]').click(); // Click TRANSFER
    cy.wait(1000);
    // Check transfer complete page, verifing correct details were returned from server
    cy.url().should('eq', 'https://parabank.parasoft.com/parabank/transfer.htm');
    cy.get('[id="rightPanel"] .title').should('have.text', 'Transfer Complete!');
    cy.get('span[id="amount"]').should('have.text', '$' + amount.toFixed(2)); 
    cy.get('span[id="fromAccountId"]').should('contain', fromAccount['Account']);    
    cy.get('span[id="toAccountId"]').should('contain', toAccount['Account']);
    // Check that Accounts Overview page show's updated account info
    fromAccount = updateFunds(fromAccount, amount, 'withdraw');
    toAccount = updateFunds(toAccount, amount, 'deposit');
    cy.get('[id="leftPanel"]').contains('Accounts Overview').click(); 
    cy.wait(1000);
    cy.get('table[id="accountTable"]').contains(fromAccount['Account']).parent().parent().within(($row) => {
      cy.get('td').eq(1).should('have.text', fromAccount['Balance*']);
    });
    cy.get('table[id="accountTable"]').contains(toAccount['Account']).parent().parent().within(($row) => {
      cy.get('td').eq(1).should('have.text', toAccount['Balance*']);
    });
    cy.get('table[id="accountTable"]').contains(fromAccount['Account']).parent().parent().within(($row) => {
      cy.get('td').eq(2).should('have.text', fromAccount['Available Amount']);
    });
    cy.get('table[id="accountTable"]').contains(toAccount['Account']).parent().parent().within(($row) => {
      cy.get('td').eq(2).should('have.text', toAccount['Available Amount']);
    })
  });
});

describe('Bill Pay', () => {
  let accounts = [];
  before(() => {
    cy.visit('/');
    cy.wait(500);
    cy.fixture('logins.json').then((user) => {
      cy.loginUI(user.myAccount);
    })
  });
  beforeEach(function() {
    Cypress.Cookies.preserveOnce('JSESSIONID', '__cfduid');
    cy.get('[id="leftPanel"]').contains('Accounts Overview').click();
    cy.wait(1500)
    cy.get('table[id="accountTable"]').then(($el) => {
      accounts = getAccountsData($el);
    });
    cy.get('[id="leftPanel"]').contains('Bill Pay').click(); 
    cy.wait(1000);
  });
  after(() => {
    cy.clearCookies();
  }); 
  
  it('Checks URL is correct on Bill Pay page', function() {
    cy.url().should('eq', 'https://parabank.parasoft.com/parabank/billpay.htm');
    cy.get('[ng-show="showForm"] .title').should('have.text', 'Bill Payment Service');
  });

  it('Verify that a bill can be paid', () => {
    var fromAccount = accounts[accounts.length-3];
    // fill out payee info and submit
    cy.fixture('payees.json').then((payee) => {
      cy.get('table').within(() => {
        cy.get('input[name="payee.name"]').type(payee.happyPayee.name);
        cy.get('input[name="payee.address.street"]').type(payee.happyPayee.addressStreet);
        cy.get('input[name="payee.address.city"]').type(payee.happyPayee.addressCity);
        cy.get('input[name="payee.address.state"]').type(payee.happyPayee.addressState);
        cy.get('input[name="payee.address.zipCode"]').type(payee.happyPayee.addressZipCode);
        cy.get('input[name="payee.phoneNumber"]').type(payee.happyPayee.phone);
        cy.get('input[name="payee.accountNumber"]').type(payee.happyPayee.account);
        cy.get('input[name="verifyAccount"]').type(payee.happyPayee.accountVerify);
        cy.get('input[name="amount"]').type(payee.happyPayee.amount);
        cy.get('select[name="fromAccountId"]').select(fromAccount['Account']);
        cy.get('input[type="submit"]').click();
        cy.wait(1000);
      });
      // Check completion page gets correct details from server
      cy.get('[ng-show="showResult"] .title').should('have.text', 'Bill Payment Complete');
      cy.get('span[id="payeeName"]').should('have.text', payee.happyPayee.name);
      cy.get('span[id="amount"]').should('have.text', dollarFormat(payee.happyPayee.amount));
      cy.get('span[id="fromAccountId"]').should('have.text', fromAccount['Account']);
      // Check transferred bill is reflected in account overview
      fromAccount = updateFunds(fromAccount, payee.happyPayee.amount, 'withdraw');
      cy.get('[id="leftPanel"]').contains('Accounts Overview').click(); 
      cy.wait(1000);
      cy.get('table[id="accountTable"]').contains(fromAccount['Account']).parent().parent().within(($row) => {
        cy.get('td').eq(1).should('have.text', fromAccount['Balance*']);
      });
      cy.get('table[id="accountTable"]').contains(fromAccount['Account']).parent().parent().within(($row) => {
        cy.get('td').eq(2).should('have.text', fromAccount['Available Amount']);
      });
    });
  });
});

describe('Find Transactions', () => {
  before(() => {
    cy.visit('/');
    cy.wait(500);
    cy.fixture('logins.json').then((user) => {
      cy.loginUI(user.myAccount);
    });
  });

  beforeEach(function() {
    Cypress.Cookies.preserveOnce('JSESSIONID', '__cfduid');
    cy.get('[id="leftPanel"]').contains('Find Transactions').click(); 
    cy.wait(1000);
  });

  after(() => {
    cy.clearCookies();
  }); 

  it('Verify Find Transactions page is open', function() {
    cy.url().should('eq', 'https://parabank.parasoft.com/parabank/findtrans.htm');
    cy.get('[id="rightPanel"] .title').should('have.text', 'Find Transactions');
  });

  it('Verify transactions can be searched by amount', function() {
    cy.get('input[ng-model="criteria.amount"]').type(amount);
    cy.get('button').eq(3).click();
  });

  it('Check log out', function() {
    cy.get('[id="leftPanel"]').contains('Log Out').click(); 
    cy.wait(1000);
  });
});

describe('Log out', () => {
  before(() => {
    cy.visit('/');
    cy.wait(500);
    cy.fixture('logins.json').then((user) => {
      cy.loginUI(user.myAccount);
    });
  });

  it('Check log out button logs user out and ends session', function() {
    cy.get('[id="leftPanel"]').contains('Log Out').click(); 
    cy.wait(1000);
    cy.get('[id="leftPanel"] h2').should('have.text', 'Customer Login');
    // Test hitting back button does not allow you to reenter account info
    // cy.go('back');
  });
});

