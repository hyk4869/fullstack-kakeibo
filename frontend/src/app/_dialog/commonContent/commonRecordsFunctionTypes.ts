import { ItemWithId } from '@/app/_util/commonFunctionTypes';

export type CommonFunctionsTypes<T extends ItemWithId> = {
  handleChangePage: (event: unknown, newPage: number, setPage: React.Dispatch<React.SetStateAction<number>>) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement>,
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>,
    setPage: React.Dispatch<React.SetStateAction<number>>,
  ) => void;
  showDialog: (setIsShowDialog: React.Dispatch<React.SetStateAction<boolean>>, isShowDialog: boolean) => void;
  handleDeleteValue: (
    id: number | null,
    arrayLastId: number,
    makeNewArray: T[],
    setMakeNewArray: React.Dispatch<React.SetStateAction<T[]>>,
    incrementArray: number[],
    setIncrementArray: React.Dispatch<React.SetStateAction<number[]>>,
    setIncrement: React.Dispatch<React.SetStateAction<number>>,
  ) => void;
};
