import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AmoutType } from '../../commonGraph/barGraph';
import { formatedNumeric, sumAmount } from '../../utils';
import { SortedDateType } from '@/app/main/monthlyAggregation/aggregationByCategory';

export const aggregationByCategoryPDF = (
  value: AmoutType[],
  aggregateDate?: SortedDateType,
  imageURL?: string,
): TDocumentDefinitions => {
  const date = new Date();
  const today = `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;

  const startDate = `${aggregateDate?.startDate?.getFullYear()}年 ${aggregateDate!.startDate!.getMonth() + 1}月`;
  const endDate = `${aggregateDate?.endDate?.getFullYear()}年 ${aggregateDate!.endDate!.getMonth() + 1}月`;

  const aggregateValue = (obj: AmoutType) => {
    const totalAmount = formatedNumeric(Number(obj.totalAmount));

    const result = [
      { text: obj.categoryName ?? '', alignment: 'center' },
      { text: `${totalAmount} 円` ?? '', alignment: 'right' },
    ];
    return result;
  };
  console.log(imageURL);
  const sortedDate = value.sort((a, b) => {
    if (a.categoryId !== null && b.categoryId !== null) {
      return a.categoryId - b.categoryId;
    } else if (a.categoryId === null && b.categoryId !== null) {
      return 1;
    } else if (a.categoryId !== null && b.categoryId === null) {
      return -1;
    } else {
      return 0;
    }
  });

  const applyFunc = sortedDate?.map((a) => aggregateValue(a));

  const totalValue = formatedNumeric(sumAmount(value.map((a) => a.totalAmount)));

  const createPDF: TDocumentDefinitions = {
    info: { title: 'カテゴリー毎の集計' },
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [35, 30, 35, 30],
    content: [
      {
        columns: [
          { text: 'カテゴリー毎の集計', style: 'title', width: 'auto' },
          { text: '作成日：', style: 'header', alignment: 'right', width: '*' },
          { text: `${today}`, style: 'header', alignment: 'left', width: 100 },
        ],
      },
      {
        style: 'table',
        color: '#444',
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'カテゴリー名', alignment: 'center', style: 'tableHeader' },
              { text: '金額', alignment: 'center', style: 'tableHeader' },
            ],
            ...(applyFunc || []).map((value, idx) => {
              if (idx === 0) {
                const result = [...value];
                return result;
              } else {
                return [...value];
              }
            }),
            [
              { text: '合計金額', alignment: 'center', style: 'fillYellow' },
              { text: `${totalValue} 円` ?? '', alignment: 'right', style: 'fillYellow' },
            ],
          ],
        },
      },
      {
        columns: [
          { text: 'データの抽出期間：', style: 'period', alignment: 'right', width: '*' },
          { text: `${startDate}`, style: 'period', alignment: 'left', width: 'auto' },
          { text: '～', style: 'period', alignment: 'left', width: 'auto' },
          { text: `${endDate}`, style: 'period', alignment: 'left', width: 'auto' },
        ],
      },
      {
        image: imageURL || '',
        width: 300,
        alignment: 'center',
        margin: [0, 30, 0, 0],
      },
    ],

    styles: {
      title: {
        fontSize: 20,
        bold: true,
      },
      header: {
        fontSize: 10,
        bold: false,
        marginLeft: 10,
        marginTop: 10,
      },
      table: {
        margin: [0, 30, 0, 0],
        fontSize: 12,
      },
      tableHeader: {
        fillColor: '#F2F2F2',
      },
      period: {
        fontSize: 10,
        bold: false,
        marginLeft: 10,
        marginTop: 10,
      },
      fillYellow: {
        fillColor: '#FFFFEF',
      },
    },
    defaultStyle: {
      font: 'NotoSerifJP',
    },
  };
  return createPDF;
};
