import { ItemWithId } from '@/app/_util/commonFunctionTypes';
import { CommonFunctionsTypes } from './commonRecordsFunctionTypes';

const useCommonRecordsFunctions = <T extends ItemWithId>(): CommonFunctionsTypes<T> => {
  /**
   * ページの変更用
   * @param event
   * @param newPage
   * @param setPage
   */
  const handleChangePage = (event: unknown, newPage: number, setPage: React.Dispatch<React.SetStateAction<number>>) => {
    setPage(newPage);
  };

  /**
   * テーブルごとの表示数
   * @param event
   * @param setRowsPerPage
   * @param setPage
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>,
    setPage: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * 次へ進むためのboolean
   * @param setIsShowDialog
   * @param isShowDialog
   */
  const showDialog = (setIsShowDialog: React.Dispatch<React.SetStateAction<boolean>>, isShowDialog: boolean) => {
    setIsShowDialog(!isShowDialog);
  };

  return { handleChangePage, handleChangeRowsPerPage, showDialog };
};

export default useCommonRecordsFunctions;
