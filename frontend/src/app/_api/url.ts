/** 共通URL */
const commonURL = 'http://localhost:3005';

/** 全期間のmonthlySpendingを取得&データのPOSTも行っている */
export const getMonthlySpending = `${commonURL}/summaryTable`;
/** 全期間のcategoryを取得 */
export const getCategory = `${commonURL}/summaryTable/category`;
/** 一部期間のmonthlyを取得 */
export const getSomeMonthlySpending = `${commonURL}/summaryTable/someContent`;
/** 削除用の POST */
export const postDeleteMonthlySpending = `${commonURL}/summaryTable/deleteContent`;
/** 会社情報を取ってくる */
export const getCompany = `${commonURL}/companyInfo/companyName`;
/** 入退社情報を取ってくる */
export const getHireDate = `${commonURL}/companyInfo/hireDate`;
/** 給与に対する税金情報を取ってくる */
export const getSalaryTax = `${commonURL}/salaryInfo/salaryTax`;
/** 給与情報を取ってくる */
export const getSalary = `${commonURL}/salaryInfo/salary`;
/** 賞与に対する税金情報を取ってくる */
export const getBonusTax = `${commonURL}/salaryInfo/bonusTax`;
/** 賞与情報を取ってくる */
export const getBonus = `${commonURL}/salaryInfo/bonus`;
