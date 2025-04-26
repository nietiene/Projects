 const prompt = require("prompt-sync")();

class BankSystem {

    constructor (name, age, id) {
        this.name = name;
        this.age = age;
        this.id = id;
        this.balance = 0;
        this.loan = 0;
    }
// Withdraw money 

    withdrawCash (cashToWithdrow) {

        if (cashToWithdrow <= this.balance) {
             this.balance = this.balance - cashToWithdrow;
             console.log(`Hello ${this.name} you withdrowed ${cashToWithdrow} your new balance is ${this.balance}`);
        } else {
            console.log (`your balance does not enough`);
        }
  }

// Deposit money

  depositCash (cashToDepose) {
    if (cashToDepose > 0) {
         this.balance = this.balance + cashToDepose;
         console.log(`Hello ${this.name} your new balance is ${this.balance}`);
    } else {
        console.log ("Enter valid money");
    }
  }
  // Check for balance
  checkBalance () {
    console.log(`Your balance is: ${this.balance}`);
  }

// Get Loan
  getLoan (loans) {
      if (this.loan === 0) {
        this.loan = loans;
        this.balance = this.balance + loans;
        console.log (`congratulation your new balance is ${this.balance}`);
      } else {
        console.log(`please pay your loan before`);
      }
  }

payLoan (amount) {
      if (amount > 0 && amount <= this.balance) {
         if (amount >= this.loan) {
            this.balance = this.balance - this.loan;
            this.loan = 0
            console.log(`You pay your loan and your new balance is ${this.balance}`);
      } else{
           this.loan = this.loan - amount;
           this.balance = this.balance - this.loan;
           console.log(`You paid ${amount} reamining loan ${this.loan}`)
      }} else {
        console.log (`Your amount does not enough`);
      }
}}

console.log ("Welcome to bank system");

// Ask user to register

const name = prompt("Enter your name: ");
const id = prompt("Enter your id: ");
const age = parseInt(prompt("Enter your age: "));

// create user account

const client = new BankSystem(name, age, id);
console.log (`Hello ${client.name} your account is ready`);

// loop through user actions

let exit = false;

while (!exit) {
    console.log (`
    --------------------------
    1. Deposit cash
    2. withdraw cash
    3. check balance
    4. request loan
    5. pay loan
    6. exit
    --------------------------       
        `);

        const option = prompt("enter our option (1-6): ");   
   
        switch (option) {
        
         case "1":
             const deposit = parseFloat(prompt("Enter amount to deposit: ")); 
             client.depositCash(deposit);
             break;
         case "2":
             const withdrow = parseFloat(prompt("Enter amount to withdraw: "));
             client.withdrawCash(withdrow);
             break;
         case "3": 
             client.checkBalance();
             break;
          case "4":
             const requestLoan = parseFloat(prompt("Enter Amount of loan: "));
             client.getLoan(requestLoan);
             break;
          case "5":
               const payLoan = parseFloat(prompt("Enter amount of loan you want to pay: "));
               client.payLoan(payLoan);
               break;
               
          case "6":
               console.log(`Good bye ${client.name}`);
               exit = true;
               break;
        
          default:
           console.log(" Invalid option");  
        } 
}
