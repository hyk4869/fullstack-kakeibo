import { ItemWithId } from '@/app/_util/commonFunctionTypes';
import { CommonFunctionsTypes } from './commonRecordsFunctionTypes';

const useCommonRecordsFunctions = <T extends ItemWithId>(): CommonFunctionsTypes<T> => {
  /**
   * ページの変更用
   * @param event
   * @param newPage
   * @param setPage
   * @returns
   */
  const handleChangePage = (event: unknown, newPage: number, setPage: React.Dispatch<React.SetStateAction<number>>) => {
    setPage(newPage);
  };

  /**
   * テーブルごとの表示数
   * @param event
   * @param setRowsPerPage
   * @param setPage
   * @returns
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
   * @returns
   */
  const showDialog = (setIsShowDialog: React.Dispatch<React.SetStateAction<boolean>>, isShowDialog: boolean) => {
    setIsShowDialog(!isShowDialog);
  };

  /**
   * 削除関数
   * @param id
   * @param arrayLastId
   * @param makeNewArray
   * @param setMakeNewArray
   * @param incrementArray
   * @param setIncrementArray
   * @param setIncrement
   * @returns
   */
  const handleDeleteValue = (
    id: number | null,
    arrayLastId: number,
    makeNewArray: T[],
    setMakeNewArray: React.Dispatch<React.SetStateAction<T[]>>,
    incrementArray: number[],
    setIncrementArray: React.Dispatch<React.SetStateAction<number[]>>,
    setIncrement: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    if (id === arrayLastId) return;
    const deletedArray = makeNewArray.filter((a) => a.id !== id);
    setMakeNewArray(deletedArray);

    if (id !== null) {
      const sortedValue = incrementArray.filter((s) => s !== id).map((a) => (a > id ? a - 1 : a));
      setIncrementArray(sortedValue);
      setMakeNewArray((prevId) =>
        prevId.map((a) => {
          return {
            ...a,
            id: a.id && a.id > id ? a.id - 1 : a.id,
          };
        }),
      );
      setIncrement(sortedValue.slice(-1)[0]);
    }
  };

  return { handleChangePage, handleChangeRowsPerPage, showDialog, handleDeleteValue };
};

export default useCommonRecordsFunctions;
