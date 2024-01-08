/** 共通URL */
const commonURL = 'http://localhost:3005';

/**
 *
 * バックエンドへのエンドポイント
 *
 */

/**
 * アカウントの作成
 */
export const createAccount = `${commonURL}/user/signUp`;
/**
 * アカウントの作成
 */
export const signInLink = `${commonURL}/auth/login`;
/**
 * 全期間のmonthlySpendingを取得&データのPOSTも行っている
 */
export const getMonthlySpending = `${commonURL}/summaryTable`;
/**
 * 全期間のcategoryを取得
 */
export const getCategory = `${commonURL}/summaryTable/category`;
/**
 * 一部期間のmonthlyを取得
 */
export const getSomeMonthlySpending = `${commonURL}/summaryTable/someContent`;
/**
 * monthlySpending削除用の POST
 */
export const postDeleteMonthlySpending = `${commonURL}/summaryTable/deleteContent`;
/**
 * 会社情報を取ってくる
 */
export const getCompany = `${commonURL}/companyInfo/companyName`;
/**
 * 入退社情報を取ってくる
 */
export const getHireDate = `${commonURL}/companyInfo/hireDate`;
/**
 * 給与に対する税金情報を取ってくる&データのPOSTも行っている
 */
export const getSalaryTax = `${commonURL}/salaryInfo/salaryTax`;
/**
 * 給与情報削除用の POST
 */
export const postDeleteSalaryTax = `${commonURL}/salaryInfo/salaryTax/deletecontent`;
/**
 * 給与情報を取ってくる&データのPOSTも行っている
 */
export const getSalary = `${commonURL}/salaryInfo/salary`;
/**
 * 給与情報削除用の POST
 */
export const postDeleteSalary = `${commonURL}/salaryInfo/salary/deletecontent`;
/**
 * 賞与に対する税金情報を取ってくる&データのPOSTも行っている
 */
export const getBonusTax = `${commonURL}/salaryInfo/bonusTax`;
/**
 * 賞与に対する税金情報削除用の POST
 */
export const postDeleteBonusTax = `${commonURL}/salaryInfo/bonusTax/deletecontent`;
/**
 * 賞与情報を取ってくる&データのPOSTも行っている
 */
export const getBonus = `${commonURL}/salaryInfo/bonus`;
/**
 * 賞与情報削除用の POST
 */
export const postDeleteBonus = `${commonURL}/salaryInfo/bonus/deletecontent`;
