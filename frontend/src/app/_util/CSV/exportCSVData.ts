// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ExportCSVData<T extends { [key: string]: any }> {
  constructor(props: { fileName: string; file: T[]; availableDate?: boolean }) {
    this._fileName = props.fileName;
    this._availableDate = props.availableDate;
    this._file = props.file;
  }

  /** ファイル名 */
  private _fileName: string;

  /** 実際のファイル */
  private _file: T[];

  /** ファイル名に日付を付与するか */
  private _availableDate?: boolean = false;

  /** BOMの付与 */
  private _bom = new Uint8Array([0xef, 0xbb, 0xbf]);

  private convertArrayToCsv(data: T[]): string {
    if (data.length === 0) {
      return '';
    }
    const header = Object?.keys(data[0]).join(',');
    const rows = data.map((item) => {
      const rowValues = Object.values(item).map((value) => (value !== null ? String(value) : ''));
      return rowValues.join(',');
    });
    return `${header}\n${rows.join('\n')}`;
  }

  private blob(): Blob {
    const csvData = this.convertArrayToCsv(this._file);

    const data = new Uint8Array([...this._bom, ...new TextEncoder().encode(csvData)]);

    return new Blob([data], { type: 'text/csv' });
  }

  private setToday(): string {
    const date = new Date();
    const yearValue = date.getFullYear().toString();
    const monthValue = (date.getMonth() + 1).toString().padStart(2, '0');
    const dateValue = date.getDate().toString().padStart(2, '0');
    return `${yearValue}-${monthValue}-${dateValue}`;
  }

  private defineName(): string {
    if (this._availableDate) {
      return `${this._fileName}-${this.setToday()}`;
    } else {
      return this._fileName;
    }
  }

  public createCSVFile(): void {
    const blobData = this.blob();
    const fileName = this.defineName();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blobData);
    link.download = `${fileName}.csv`;

    link.click();

    // 作成したリンクを削除
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }
}
