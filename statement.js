function statement (invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances;
  return renderPlainText(statementData, plays);
}

function renderPlainText(data, plays) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    // print line for this order
    result += ` ${playFor(perf, plays).name}: ${usd(amountFor(perf, plays))} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmount(data, plays))}\n`;
  result += `You earned ${totalVolumeCredits(data, plays)} credits\n`;
  return result;
}

function totalAmount(data, plays) {
  let result = 0;
  for (let perf of data.performances) {
    result += amountFor(perf, plays);
  }
  return result;
}

function totalVolumeCredits(data, plays) {
  let result = 0;
  for (let perf of data.performances) {
    result += volumeCreditsFor(perf, plays);
  }
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US",
                              { style: "currency", currency: "USD",
                              minimumFractionDigits: 2 }).format(aNumber/100);
}

function volumeCreditsFor(aPerformance, plays) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
  if ("comedy" === playFor(aPerformance, plays).type)
  result += Math.floor(aPerformance.audience / 5);
  return result;
}

function amountFor(aPerformance, plays) {
  let result = 0;
  switch (playFor(aPerformance, plays).type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${playFor(aPerformance, plays).type}`);
  }
  return result;
}

function playFor(aPerformance, plays) {
 return plays[aPerformance.playID];
}

export default statement;
