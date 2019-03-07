import * as PLAYS from './plays.json';
import * as INVOICE from './invoices.json';

export default function createStatementData() {
  const statementData = {};
  statementData.customer = INVOICE.customer;
  statementData.performances = INVOICE.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
}

function enrichPerformance(aPerformance) {
  const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
  const result = Object.assign({}, aPerformance);
  result.play = calculator.play;
  result.amount = calculator.getAmount();
  result.volumeCredits = calculator.getVolumeCredits();
  return result;
}

function createPerformanceCalculator(aPerformance, aPlay) {
 return new PerformanceCalculator(aPerformance, aPlay);
}

function totalAmount(data) {
  return data.performances.reduce((total, p) => total + p.amount, 0);
}

function totalVolumeCredits(data) {
  return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}

function amountFor(aPerformance) {
    return new PerformanceCalculator(aPerformance,playFor(aPerformance)).getAmount();
}

function playFor(aPerformance) {
 return PLAYS[aPerformance.playID];
}

class PerformanceCalculator {
 constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
 }

 getAmount(){
    let result = 0;
    switch (this.play.type) {
        case "tragedy":
            result = 40000;
            if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
            }
        break;
            case "comedy":
            result = 30000;
            if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
            }
            result += 300 * this.performance.audience;
        break;
        default:
            throw new Error(`unknown type: ${this.play.type}`);
        }
    return result;
 }
 getVolumeCredits() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if ("comedy" === this.play.type) result +=
   Math.floor(this.performance.audience / 5);
    return result;
   }
}