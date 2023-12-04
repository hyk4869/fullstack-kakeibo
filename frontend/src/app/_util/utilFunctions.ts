import { TMonthlySpending } from '../_store/slice';
import { MonthlyGrouping } from '../main/monthlyAggregation/aggregationByMonth';

export type Order = 'asc' | 'desc';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
  return order === 'desc'
    ? function (a: T, b: T) {
        return descendingComparator(a, b, orderBy);
      }
    : function (a: T, b: T) {
        return -descendingComparator(a, b, orderBy);
      };
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map(function (el, index) {
    return [el, index] as [T, number];
  });
  stabilizedThis.sort(function (a, b) {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(function (el) {
    return el[0];
  });
}

/** 月ごとに合計を集計 */
export const monthlyArray = (monthlyData: TMonthlySpending[]) => {
  const groupedByMonth: MonthlyGrouping = {};

  for (const entry of monthlyData) {
    const paymentDay = entry.paymentDay;

    if (paymentDay) {
      const monthKey = `${paymentDay.getFullYear()}-${paymentDay.getMonth() + 1}`;

      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = { data: [], totalUsageFee: 0 };
      }

      groupedByMonth[monthKey].data.push(entry);
      groupedByMonth[monthKey].totalUsageFee += entry.usageFee || 0;
    }
  }

  return groupedByMonth;
};

// const groupingArray = () => {
//   const groups: any[] = [];
//   let currentGroup: any[] = [];

//   for (let i = 0; i < monthlyData.length; i++) {
//     const stringVal = monthlyData[i];
//     const storeName = stringVal.store;
//     const paymentDay = stringVal.paymentDay;

//     if (storeName?.includes('ユーネクスト')) {
//       groups.push([...currentGroup]);
//       currentGroup = [];
//     }

//     if (paymentDay !== null) {
//       currentGroup.push(stringVal);
//     }
//   }

//   if (currentGroup.length > 0) {
//     groups.push([...currentGroup]);
//   }

//   console.log(groups);
// };
