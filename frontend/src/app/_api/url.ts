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
 * トークンの確認
 */
export const verifyTokenLink = `${commonURL}/auth/verifyToken`;

/**
 * 全てのマスタデータを取得する
 */
export const getAllMasterData = `${commonURL}/masterData`;

/**
 * 全期間のmonthlySpendingを取得&データのPOSTも行っている
 */
export const getMonthlySpending = `${commonURL}/summaryTable`;

/**
 * 全期間のcategoryを取得&データのPOSTも行っている
 */
export const getCategoryLink = `${commonURL}/summaryTable/category`;

/**
 * 一部期間のmonthlyを取得
 */
export const getSomeMonthlySpending = `${commonURL}/summaryTable/someContent`;

/**
 * monthlySpending削除用の POST
 */
export const postDeleteMonthlySpending = `${commonURL}/summaryTable/deleteContent`;

/**
 * 会社情報を取ってくる&データのPOSTも行っている
 */
export const getCompany = `${commonURL}/companyInfo/companyName`;

/**
 * 入退社情報を取ってくる&データのPOSTも行っている
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
export const getBonusTax = `${commonURL}/bonusInfo/bonusTax`;

/**
 * 賞与に対する税金情報削除用の POST
 */
export const postDeleteBonusTax = `${commonURL}/bonusInfo/bonusTax/deletecontent`;

/**
 * 賞与情報を取ってくる&データのPOSTも行っている
 */
export const getBonus = `${commonURL}/bonusInfo/bonus`;

/**
 * 賞与情報削除用の POST
 */
export const postDeleteBonus = `${commonURL}/bonusInfo/bonus/deletecontent`;

/**
 * テストAPI
 */
export const getAllIncomeLink = `${commonURL}/all-income-info`;

/**
 * テストAPI
 */
export const testAPILink = `${commonURL}/test-api/test-post`;
