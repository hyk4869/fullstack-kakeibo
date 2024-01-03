import { CommonUtils, ItemWithId } from './commonFunctionTypes';

/** ジェネリクスで書いた共通の処理 */
const useCommonFunctions = <T extends ItemWithId>(): CommonUtils<T> => {
  /**
   * 全選択のクリック関数
   * @param setSelected
   * @param arrayContent 配列
   * @param event boolean event
   * @returns
   */
  const handleSelectAllClick = (
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    arrayContent: T[],
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelected([]);
    if (event.target.checked) {
      setSelected((setNum) => {
        if (arrayContent) {
          const filteredData: number[] = arrayContent.filter((d) => d.sort !== null).map((d) => d.sort as number);
          return [...setNum, ...filteredData];
        }
        return setNum;
      });
      return;
    }
    setSelected([]);
  };

  /**
   * 行または項目の選択に対しての判定
   * @param event
   * @param id
   */
  const handleSelect = (
    event: React.MouseEvent<unknown>,
    id: number,
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    selected: number[],
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((itemId) => itemId !== id);
    }

    setSelected(newSelected);
  };

  /**
   * ページの移動
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
   * 要素の選択
   * @param id
   * @param selected
   * @returns
   */
  const isSelected = (id: number, selected: number[]): boolean => selected.indexOf(id) !== -1;

  /**
   * edit関数
   * @param setEdit
   */
  const handleEditFlag = (setEdit: React.Dispatch<React.SetStateAction<boolean>>) => {
    setEdit((edit) => !edit);
  };

  /**
   * 個別のedit関数
   * @param setEdit
   * @param id
   * @param arraySomething
   */
  const handleIndividualEdit = (
    id: number,
    arraySomething: T[],
    setRowNumber: React.Dispatch<React.SetStateAction<number>>,
    setIsEditable: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (arraySomething) {
      const result = arraySomething.find((a) => a.sort === id)?.sort;
      setRowNumber(result as number);
      setIsEditable((prev) => !prev);
    }
  };

  /**
   * 削除関数
   * @param id
   * @param setEditValue
   * @param setDeleteSomething
   */
  const handledeleteValue = (
    id: number | null,
    setEditValue: React.Dispatch<React.SetStateAction<T[]>>,
    setDeleteSomething: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    if (id !== null) {
      setEditValue((prevData) => {
        const updatedData = prevData.filter((d) => d.sort !== id);
        const deleteContent = prevData.filter((d) => d.sort === id);
        setDeleteSomething((prev) => {
          const uniqueDeleteContent = deleteContent.filter(
            (item) => !prev.some((existingItem) => existingItem.sort === item.sort),
          );
          return [...prev, ...uniqueDeleteContent];
        });
        return updatedData;
      });
    }
  };

  /**
   * 一括削除
   * @param setEditValue
   * @param setDeleteSomething
   * @param setSelected
   * @param selected
   */
  const handleDeleteArrayValue = (
    setEditValue: React.Dispatch<React.SetStateAction<T[]>>,
    setDeleteSomething: React.Dispatch<React.SetStateAction<T[]>>,
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    selected: number[],
  ) => {
    setEditValue((prevValue) => {
      const updatedData = prevValue.filter((a) => !selected.includes(Number(a.sort)));
      const deleteContent = prevValue.filter((a) => selected.includes(Number(a.sort)));
      setDeleteSomething((prev) => {
        const uniqueDeleteContent = deleteContent.filter(
          (item) => !prev.some((existingItem) => existingItem.sort === item.sort),
        );
        return [...prev, ...uniqueDeleteContent];
      });
      return updatedData;
    });
    setSelected([]);
  };

  return {
    handleSelectAllClick,
    handleSelect,
    handleChangePage,
    handleChangeRowsPerPage,
    isSelected,
    handleEditFlag,
    handledeleteValue,
    handleDeleteArrayValue,
    handleIndividualEdit,
  };
};

export default useCommonFunctions;
