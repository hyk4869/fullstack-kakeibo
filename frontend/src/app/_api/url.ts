/** 全期間のmonthlySpendingを取得&データのPOSTも行っている */
export const getMonthlySpending = 'http://localhost:3005/summaryTable';
/** 全期間のcategoryを取得 */
export const getCategory = 'http://localhost:3005/summaryTable/category';
/** 一部期間のmonthlyを取得 */
export const getSomeMonthlySpending = 'http://localhost:3005/summaryTable/someContent';
/** 削除用の POST */
export const postDeleteMonthlySpending = 'http://localhost:3005/summaryTable/deleteContent';
/** 会社情報を取ってくる */
export const getCompany = 'http://localhost:3005/salaryInfo/companyName';
/** 入退社情報を取ってくる */
export const getHireDate = 'http://localhost:3005/salaryInfo/hireDate';
