import { TDocumentDefinitions } from 'pdfmake/interfaces';

export const aggregationByCategoryPDF = (): TDocumentDefinitions => {
  const createPDF: TDocumentDefinitions = {
    info: { title: 'カテゴリー毎の集計' },
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [20, 30, 10, 20],
    content: [
      {
        columns: [{ text: 'カテゴリー毎の集計', style: 'title', width: 'auto' }],
      },
    ],
    styles: {
      title: {
        fontSize: 20,
        bold: true,
      },
    },
    defaultStyle: {
      font: 'NotoSerifJP',
    },
  };
  return createPDF;
};
