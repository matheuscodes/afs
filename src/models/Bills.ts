import { MeterPayment, MeterMeasurement, MeterPrice } from './Home'

export function getCurrentPrice(measurement: MeterMeasurement, prices: MeterPrice[]) {
  return prices.find((i: MeterPrice) => i.date <= measurement.date);
}

export function dateDifference(a: string | Date, b: string | Date) {
  return (new Date(a).getTime() - new Date(b).getTime()) / (1000 * 60 * 60 * 24)
}

function paymentsByBill(payments: MeterPayment[]): Record<string, any> {
  return payments.reduce((acc: Record<string, any[]>, payment: MeterPayment) => {
    const key = `${payment.bill}`;
    // Group initialization
    if (!acc[key]) {
      acc[key] = [];
    }

    // Grouping
    acc[key].push(payment);

    return acc;
  }, {});
}

export function groupedPayments(payments: MeterPayment[]): any[] {
  const groupBy: Record<string, any> = paymentsByBill(payments);
  if(!payments) return [];
  return Object.keys(groupBy).map((i: string) => groupBy[i]).map((group: any) => {
    return {
      from: new Date(Math.min(...group.map((i: MeterPayment) => new Date(i.date).getTime()))),
      to: new Date(Math.max(...group.map((i: MeterPayment) => new Date(i.date).getTime()))),
      sum: {
        amount: group.map((i: MeterPayment) => i.value.amount).reduce((a: number,b: number) => a+b, 0),
        currency: group[0].value.currency
      },
      bill: group[0].bill
    }
  })
}
