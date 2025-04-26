
class BankSystem {

    constructor (name, age, id) {
        this.name = name;
        this.age = age;
        this.id =  id;
        this.balance = 0;
        this.loan = 0;
    }

    withDrow (cashToWithdrow) {
         
        if (cashToWithdrow <= this.balance) {
              this.balance = this.balance -= cashToWithdrow;
              console.log(`Hello ${this.name} your new balance is ${this.balance}`)
        } else {
            console.log(`Sorry ${this.name} your balance does not enough`);
        }
    }

    depose (moneyToDepose) {

        if (moneyToDepose != 0) {
            this.balance = this.balance + moneyToDepose;
            console.log(`Hello ${this.name} your new balance is ${this.balance}`);
        } else {
            console.log("Invalid money");
        }
    }

    getloan (cashToLoan) {

      if (this.loan = 0) { 
        if (cashToLoan != 0) {
              this.loan = this.loan + cashToLoan;
              this.balance = this.balance + this.loan;
              console.log(`Hello ${this.name} your new balance is ${this.balance}`);
        } else {
            console.log("Enter valid loan");
        }
    } else {
        console.log(`Hello ${this.name} please pay loan before request another one`);
    }
    }

    checkBalance () {
        console.log(`Your balance is ${this.balance}`);
    }
}


const client = new BankSystem("Etiene", 18, 123568997);

client.withDrow(2000);
client.depose(100);
client.getloan(2000);
client.checkBalance();