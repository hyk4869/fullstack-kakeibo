import { MCategory, MCompany, MHireDate, TMonthlySpending, TSalary } from '../_store/interfacesInfo';
import { ReferenceType } from '../main/category/categoyTable';
import { AmoutType, MonthlyGrouping } from './commonGraph/barGraph';

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
    const categoryId = category.id;

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

/** 最新の日付を取得 */
export const getLatestDate = (monthlyData: TMonthlySpending[]): Date => {
  const latestDate = new Date(Math.max(...monthlyData.map((date) => date.paymentDay?.getTime() || 0)));
  return latestDate;
};

/** 最も古い日付を取得 */
export const getOldDate = (monthlyData: TMonthlySpending[]): Date => {
  const result = new Date(Math.min(...monthlyData.map((date) => date.paymentDay?.getTime() || 0)));
  return result;
};

/**
 * 新しい値を作成する際にidのincrementを返す
 * @param makeNewArray 更新用の配列
 * @param arrayFormRedux reduxからの配列
 * @param incrementArray idを格納する配列
 * @returns number
 */
export const incrementFromArray = <T, U>(makeNewArray: T[], arrayFormRedux: U[], incrementArray: number[]): number => {
  if (makeNewArray.length !== 0 || arrayFormRedux.length > 0) {
    return incrementArray.slice(-1)[0] + 1;
  } else {
    return 1;
  }
};

/**
 * CSVをインポートした際にきれいな形に成型する
 * @param array TMonthlySpending
 * @returns
 */
export const convertMonthlySpendingTypes = <T extends TMonthlySpending>(array: T[]): TMonthlySpending[] => {
  return array
    .map((s) => {
      return {
        ...s,
        id: s.id !== null ? parseInt(String(s.id)) : null,
        paymentDay: s.paymentDay !== null ? new Date(s.paymentDay) : null,
        categoryId: s.categoryId !== null ? parseInt(String(s.categoryId)) : null,
        usageFee: s.usageFee !== null ? parseInt(String(s.usageFee)) : null,
      };
    })
    .filter((a) => a.id);
};

/**
 * setStateする前にnullCheckを行う。
 * @param array TMonthlySpending
 * @returns
 */
export const monthlySpendingNullCheck = <T extends TMonthlySpending>(array: T[]): TMonthlySpending[] => {
  return array.filter(
    (a) => a.id !== null && a.paymentDay !== null && a.store !== '' && a.usageFee !== null && a.categoryId !== null,
  );
};

/**
 * CSVをインポートした際にきれいな形に成型する
 * @param array MCategory
 * @returns
 */
export const convertCategoryTypes = <T extends MCategory>(array: T[]): MCategory[] => {
  return array
    .map((s) => {
      return {
        ...s,
        id: s.id !== null ? parseInt(String(s.id)) : null,
        categoryName: s.categoryName !== null ? String(s.categoryName) : null,
      };
    })
    .filter((a) => a.id);
};

/**
 * setStateする前にnullCheckを行う。
 * @param array MCategory
 * @returns
 */
export const categoryNullCheck = <T extends MCategory>(array: T[]): MCategory[] => {
  return array.filter((a) => a.id !== null && a.categoryName !== '');
};

/**
 * CSVをインポートした際にきれいな形に成型する
 * @param array MCompany
 * @returns
 */
export const convertCompanyTypes = <T extends MCompany>(array: T[]): MCompany[] => {
  return array
    .map((s) => {
      return {
        ...s,
        categoryId: s.id !== null ? parseInt(String(s.id)) : null,
        categoryName: s.name !== null ? String(s.name) : null,
        majorSector: s.majorSector !== null ? String(s.majorSector) : null,
      };
    })
    .filter((a) => a.categoryId);
};

/**
 * setStateする前にnullCheckを行う。
 * @param array MCompany
 * @returns
 */
export const companyNullCheck = <T extends MCompany>(array: T[]): MCompany[] => {
  return array.filter((a) => a.id !== null && a.name !== '' && a.majorSector !== '');
};

/**
 * CSVをインポートした際にきれいな形に成型する
 * @param array MHireDate
 * @returns
 */
export const convertHireDateTypes = <T extends MHireDate>(array: T[]): MHireDate[] => {
  return array
    .map((s) => {
      return {
        ...s,
        id: s.id !== null ? parseInt(String(s.id)) : null,
        companyId: s.companyId !== null ? parseInt(String(s.companyId)) : null,
        hireDate: s.hireDate !== null ? new Date(s.hireDate) : null,
        retirementDate: s.retirementDate !== null ? new Date(s.retirementDate) : null,
      };
    })
    .filter((a) => a.id);
};

/**
 * setStateする前にnullCheckを行う。
 * @param array MHireDate
 * @returns
 */
export const hireDateNullCheck = <T extends MHireDate>(array: T[]): MHireDate[] => {
  return array.filter((a) => a.id !== null && a.companyId !== null && a.hireDate !== null);
};

/** 最新の日付を取得 */
export const getLatestSalaryDate = (salaryData: TSalary[]): Date => {
  const latestDate = new Date(Math.max(...salaryData.map((date) => date.payday?.getTime() || 0)));
  return latestDate;
};

/** 最も古い日付を取得 */
export const getOldSalaryDate = (salaryData: TSalary[]): Date => {
  const result = new Date(Math.min(...salaryData.map((date) => date.payday?.getTime() || 0)));
  return result;
};
