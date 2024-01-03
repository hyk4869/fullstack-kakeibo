export type ItemWithId = {
  sort: number | null;
};
/** ジェネリクスで書いた共通の処理 */
export type CommonUtils<T extends ItemWithId> = {
  /** 全選択のクリック関数 */
  handleSelectAllClick: (
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    arrayContent: T[],
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /** 行または項目の選択に対しての判定 */
  handleSelect: (
    event: React.MouseEvent<unknown>,
    id: number,
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    selected: number[],
  ) => void;
  /** ページの移動 */
  handleChangePage: (event: unknown, newPage: number, setPage: React.Dispatch<React.SetStateAction<number>>) => void;
  /** テーブルごとの表示数 */
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement>,
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>,
    setPage: React.Dispatch<React.SetStateAction<number>>,
  ) => void;
  /** 要素の選択 */
  isSelected: (id: number, selected: number[]) => boolean;
  /** edit関数 */
  handleEditFlag: (setEdit: React.Dispatch<React.SetStateAction<boolean>>) => void;
  /** 削除関数 */
  handledeleteValue: (
    id: number | null,
    setEditValue: React.Dispatch<React.SetStateAction<T[]>>,
    setDeleteSomething: React.Dispatch<React.SetStateAction<T[]>>,
  ) => void;
  /** 一括削除 */
  handleDeleteArrayValue: (
    setEditValue: React.Dispatch<React.SetStateAction<T[]>>,
    setDeleteSomething: React.Dispatch<React.SetStateAction<T[]>>,
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    selected: number[],
  ) => void;
  /** 個別のedit関数 */
  handleIndividualEdit: (
    id: number,
    arraySomething: T[],
    setRowNumber: React.Dispatch<React.SetStateAction<number>>,
    setIsEditable: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
};
