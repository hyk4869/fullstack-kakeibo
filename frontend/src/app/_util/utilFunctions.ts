import { MCategory, TMonthlySpending } from '../_store/slice';
import { ReferenceType } from '../main/category/categoyTable';
import { AmoutType } from '../main/monthlyAggregation/aggregationByCategory';
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

/** 月毎に合計を集計 */
export const sumEachMonthlyArray = (monthlyData: TMonthlySpending[]): MonthlyGrouping => {
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

/** カテゴリーが使われている数を算出 */
export const sumEachCategory = (categoryData: MCategory[], monthlyData: TMonthlySpending[]) => {
  const calclatedAmount: Array<ReferenceType> = [];

  categoryData.forEach((category: MCategory) => {
    const categoryName = category.categoryName;
    const categoryId = category.categoryId;

    const findMonthlyData = monthlyData.filter(
      (monthly: TMonthlySpending) => monthly.category?.categoryName === categoryName,
    );
    const countEachCategory = findMonthlyData.length;

    calclatedAmount.push({
      categoryName: categoryName,
      categoryId: categoryId,
      totalCategoryName: countEachCategory,
    });
  });

  return calclatedAmount;
};

/** カテゴリー毎に合計を集計 */
export const sumEachCategoryByMonthly = (monthlyData: TMonthlySpending[]): AmoutType[] => {
  const categoryTotal: { [categoryId: number]: { total: number; categoryName?: string } } = {};

  monthlyData.forEach((d) => {
    const categoryId = d.categoryId;
    const usageFee = d.usageFee || 0;
    const categoryName = d.category?.categoryName;

    if (categoryId !== null) {
      categoryTotal[categoryId] = {
        total: (categoryTotal[categoryId]?.total || 0) + usageFee,
        categoryName: categoryName ?? '',
      };
    }
  });

  const newAmount: AmoutType[] = Object.entries(categoryTotal).map(([categoryId, { total, categoryName }]) => ({
    categoryId: parseInt(categoryId, 10) ?? null,
    totalAmount: total ?? null,
    categoryName: categoryName ?? null,
  }));

  return newAmount.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0)).reverse();
};

/** 配列内の要素を合計 */
export const sumAmount = (amount: (number | null)[]): number => {
  if (amount === null || amount.length === 0) return 0;
  let sum = 0;
  amount.forEach((d) => {
    if (d !== null) {
      sum += d;
    }
  });
  return sum;
};

/** 平均計算 */
export const calcAvg = (numberArray: (number | null)[]): number => {
  if (numberArray === null || numberArray.length === 0) return 0;
  let sum = 0;
  let denominator = 0;

  numberArray.forEach((d) => {
    if (d !== null) {
      sum += d;
      denominator++;
    }
  });
  if (denominator === 0) return 0;
  const result = (Math.round(sum / denominator) * 10) / 10;
  return result;
};
