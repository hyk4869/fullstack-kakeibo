import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { formatedNumeric } from '../../utils';
import { SortedDateType } from '@/app/main/monthlyAggregation/aggregationByCategory';
import { AmountTypeWithTax } from '@/app/main/monthlyAggregation/aggregationByAnnualIncome';

export const aggregationByAnnualIncomePDF = (
  value: AmountTypeWithTax[],
  aggregateDate?: SortedDateType,
  imageURL?: string,
): TDocumentDefinitions => {
  const date = new Date();
  const today = `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;

  const startDate = () => {
    if (aggregateDate?.startDate?.getFullYear()) {
      return `${aggregateDate.startDate.getFullYear()}年 `;
    } else {
      return '';
    }
  };

  const endDate = () => {
    if (aggregateDate?.endDate?.getFullYear()) {
      return `${aggregateDate.endDate.getFullYear()}年 `;
    } else {
      return '';
    }
  };

  const aggregateValue = (obj: AmountTypeWithTax) => {
    const totalAmount = formatedNumeric(Number(obj.totalAmount));
    const annualTax = formatedNumeric(Number(obj.annualTax));
    const taxPercentage = formatedNumeric(Number(obj.taxPercentage));
    const disposableIncome = formatedNumeric(Number(obj.disposableIncome));

    const result = [
      { text: obj.categoryId ?? '', alignment: 'center' },
      { text: `${totalAmount} 円` ?? '', alignment: 'right' },
      { text: `${annualTax} 円` ?? '', alignment: 'right' },
      { text: `${taxPercentage} %` ?? '', alignment: 'right' },
      { text: `${disposableIncome} 円` ?? '', alignment: 'right' },
    ];
    return result;
  };

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

  const createPDF: TDocumentDefinitions = {
    info: { title: '年収計算' },
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [35, 30, 35, 30],
    content: [
      {
        columns: [
          { text: '年収計算', style: 'title', width: 'auto' },
          { text: '作成日：', style: 'header', alignment: 'right', width: '*' },
          { text: `${today}`, style: 'header', alignment: 'left', width: 100 },
        ],
      },
      {
        style: 'table',
        color: '#444',
        table: {
          widths: ['*', '*', '*', '*', '*'],
          body: [
            [
              { text: '年', alignment: 'center', style: 'tableHeader' },
              { text: '年収', alignment: 'center', style: 'tableHeader' },
              { text: '税金等', alignment: 'center', style: 'tableHeader' },
              { text: '税率', alignment: 'center', style: 'tableHeader' },
              { text: '可処分所得', alignment: 'center', style: 'tableHeader' },
            ],
            ...(applyFunc || []).map((value, idx) => {
              if (idx === 0) {
                const result = [...value];
                return result;
              } else {
                return [...value];
              }
            }),
          ],
        },
      },
      {
        columns: [
          { text: 'データの抽出期間：', style: 'period', alignment: 'right', width: '*' },
          { text: `${startDate()}`, style: 'period', alignment: 'left', width: 'auto' },
          { text: '～', style: 'period', alignment: 'left', width: 'auto' },
          { text: `${endDate()}`, style: 'period', alignment: 'left', width: 'auto' },
        ],
      },
      {
        image: imageURL || '',
        width: 320,
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
