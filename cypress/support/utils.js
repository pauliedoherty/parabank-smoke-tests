import $ from 'jQuery';

function updateFunds(account, amount, op) {
  if(op != 'deposit' && op != 'withdraw') {
    throw new Error("Bad input to updateAccountFunds");
  }
  var balance = account['Balance*']
  var available = account['Available Amount']
  balance = balance.replace('$', '');
  available = available.replace('$', '');
  // update balance
  switch(op) {
    case 'deposit':
      balance = parseFloat(balance) + parseFloat(amount);
      break;
    case 'withdraw': 
      balance = parseFloat(balance) - parseFloat(amount);
      break;
  }
  // update available accounting for negative balance
  balance < 0 ? available = 0 : available = balance;
  // convert to string with 2 decimal places
  balance = balance.toFixed(2);
  available = available.toFixed(2);
  // add $
  balance = dollarFormat(balance);
  available = dollarFormat(available);
  account['Balance*'] = balance;
  account['Available Amount'] = available;
  return account;
}

function dollarFormat(amount) {
  amount[0] == '-' ? amount = '-' + '$' + amount.substring(1) 
    : amount = '$' + amount
  return amount;
}

function getAccountsData(el) {
  var headers = [];
  var accDetails = [];
  el.find('th').each(function(index, item) {
    headers[index] = $(item).text();
  });
    el.find('tr').has('td').each(function() {
      var accItem = {};
      $($(this).find('td')).each(function(index, item) {
        accItem[headers[index]] = $(item).text();
      });
      accDetails.push(accItem);
  });
  console.log(accDetails);
  return accDetails;
}

export { updateFunds, dollarFormat, getAccountsData }
export const amount = 100.05; // used for transfers and bill pay