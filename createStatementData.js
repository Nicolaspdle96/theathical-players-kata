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
 switch(aPlay.type) {
 case "tragedy": return new TragedyCalculator(aPerformance,aPlay);
 case "comedy" : return new ComedyCalculator(aPerformance,aPlay);
 default:
 throw new Error(`unknown type: ${aPlay.type}`);
 }
}

function totalAmount(data) {
  return data.performances.reduce((total, p) => total + p.amount, 0);
}

function totalVolumeCredits(data) {
  return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
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
    throw new Error('subclass responsibility');
 }

 getVolumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
   }
}

class TragedyCalculator extends PerformanceCalculator {
    getAmount() {
        let result = 40000;
        if (this.performance.audience > 30) {
        result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    getAmount() {
     let result = 30000;
     if (this.performance.audience > 20) {
     result += 10000 + 500 * (this.performance.audience - 20);
     }
     result += 300 * this.performance.audience;
     return result;
    }

    getVolumeCredits() {
        return super.getVolumeCredits() + Math.floor(this.performance.audience/5);
    }
}