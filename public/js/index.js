let debt = document.getElementById("debt");
let rate = document.getElementById("interestRate");

//variables when user enters in monthly payment
let monthlyPayment = document.getElementById("monthlyPayment");
let calculatedMonths = document.getElementById("calculatedMonths");
let calculatedInterest = document.getElementById("calculatedInterest");
let howLongToPayoffSubmit = document.getElementById("howLongToPayoffSubmit");

//variables when user enters in length of time to pay off
let numMonths = document.getElementById("timespan");
let howMuchToPaySubmit = document.getElementById("howMuchToPaySubmit");
let calculatedAdvisedPayment = document.getElementById("calculatedAdvisedPayment");
let calculatedAdvisedPaymentInterest = document.getElementById("calculatedAdvisedPaymentInterest");

//result elements
let monthlyPaymentResult = document.getElementById("monthlyPaymentResult");
let howMuchToPayResult = document.getElementById("howMuchToPayResult");




function requiredValuesCheckingPayment()
{
    return !(debt.value && rate.value && monthlyPayment.value);
}

function requiredValuesCheckingMonths(){
    return !(debt.value && rate.value && numMonths.value);
}

function calculateInterest(currentDebt){
    let interestAccrued = 0;
    let adjustedRate = (rate.value/100)/365;
    let accruingDebt = parseInt(currentDebt, 10);
    for (let i = 0; i < 30; i++){
        interestAccrued += (accruingDebt)*(adjustedRate);
        accruingDebt += interestAccrued;
    }

    return Math.round(interestAccrued*100)/100;
}

//Given a monthly payment amount this function will calculate how long
//it will take to pay off your debt.
function howLongToPayOff(){
    
    monthlyPaymentResult.classList.remove('visible');
    monthlyPaymentResult.classList.add('invisible');
    if(requiredValuesCheckingPayment()){
        return;
    }
    let totalInterest = 0;
    let numberOfMonths = 0;
    let currentDebt = parseInt(debt.value, 10);
    let payment = parseInt(monthlyPayment.value, 10);
    while (currentDebt > 0){
        //Calculate interest add it to debt
        //Then subtract the payment for the month
        let interest = calculateInterest(currentDebt);
        currentDebt += interest;
        currentDebt -= payment;
        console.log ("Monthly payment is: " + payment);
        console.log("Debt is " + currentDebt);
        //let interest = calculateInterest(currentDebt);
        console.log("Interest is: " + interest);
        
        //Condition to break out loop if payment is less than the interest
        //accruing as it will cause infinite loop.
        if (payment < interest)
        {
            return;
        }
        numberOfMonths++;

        //Variable to allow tracking for the total interest paid.
        //Conditiion is set to avoid negative interest
        if (interest > 0 || currentDebt < 0){
            totalInterest += interest;
        }
    }
    // console.log("It will take " + numMonths +
    // " months to payoff your debt. You will have paid " + totalInterest + " in interest.");
    calculatedMonths.textContent = "It will take " + numberOfMonths + " month(s) to payoff your debt";
    calculatedInterest.textContent = "You will have paid " + Math.round((totalInterest*100)/100) + " in interest";
    monthlyPaymentResult.classList.remove('invisible');
    monthlyPaymentResult.classList.add('visible');
    return [numberOfMonths, totalInterest];
}

//Given a set amount of time this function will estimate how much money
//you will need to pay monthly to pay-off debt in numMonths time.
function howMuchToPay(){
    howMuchToPayResult.classList.remove('visible');
    howMuchToPayResult.classList.add('invisible');
    if (requiredValuesCheckingMonths())
    {
        return;
    }
    let currentDebt = parseInt(debt.value, 10);
    let timespan = parseInt(numMonths.value, 10);
    let adjustedRate = (rate.value/100)/12;
    let numerator =  adjustedRate*currentDebt;
    let denominator = 1 - ((1 + adjustedRate)**-timespan);
    let advisedPayment = Math.round(numerator/denominator);

     console.log("current Debt: " + currentDebt + "\ntimespan: " + timespan +
     "\nArate: " + adjustedRate + "\nnumerator: " + numerator + "\ndenominator: " +
     denominator + "\nadvisedPayment: " + advisedPayment);
     console.log("You will need to pay " + advisedPayment + 
     " dollars per month to pay off your debt in " + timespan + " month(s).");
    
    
    calculatedAdvisedPayment.textContent = "Advised monthly payment is $" + advisedPayment;
    calculatedAdvisedPaymentInterest.textContent = "You will have paid $" + ((advisedPayment*timespan) - currentDebt) + " in interest";
    howMuchToPayResult.classList.remove('invisible');
    howMuchToPayResult.classList.add('visible');
    return advisedPayment;
}

howLongToPayoffSubmit.addEventListener("click", howLongToPayOff);
howMuchToPaySubmit.addEventListener("click", howMuchToPay);
