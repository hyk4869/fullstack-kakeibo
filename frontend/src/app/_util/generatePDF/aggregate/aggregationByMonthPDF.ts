import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AmoutType, MonthlyGrouping } from '../../commonGraph/barGraph';
import { formatedNumeric, sumAmount } from '../../utils';
import { SortedDateType } from '@/app/main/monthlyAggregation/aggregationByCategory';
import dayjs from 'dayjs';

export const aggregationByMonthPDF = (
  value: MonthlyGrouping,
  aggregateDate?: SortedDateType,
  imageURL?: string,
): TDocumentDefinitions => {
  const date = new Date();
  const today = `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;

  const startDate = () => {
    if (aggregateDate?.startDate?.getFullYear() && aggregateDate?.startDate?.getMonth()) {
      return `${aggregateDate.startDate.getFullYear()}年 ${aggregateDate.startDate.getMonth() + 1}月`;
    } else {
      return '';
    }
  };

  const endDate = () => {
    if (aggregateDate?.endDate?.getFullYear() && aggregateDate?.endDate?.getMonth()) {
      return `${aggregateDate.endDate.getFullYear()}年 ${aggregateDate.endDate.getMonth() + 1}月`;
    } else {
      return '';
    }
  };

  const aggregateValue = (totalUsageFee: number, date: string) => {
    const totalAmount = formatedNumeric(Number(totalUsageFee));

    const result = [
      { text: date ?? '', alignment: 'center' },
      { text: `${totalAmount} 円` ?? '', alignment: 'right' },
    ];

    return result;
  };

  const applyFunc = Object.entries(value)
    .sort(([a], [b]) => dayjs(a).diff(dayjs(b)))
    ?.map((a) => aggregateValue(a[1].totalUsageFee, a[0]));

  const totalValue = formatedNumeric(sumAmount(Object.entries(value).map(([_, b]) => b.totalUsageFee)));

  const createPDF: TDocumentDefinitions = {
    info: { title: '各期間の集計' },
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [35, 30, 35, 30],
    content: [
      {
        columns: [
          { text: '各期間の集計', style: 'title', width: 'auto' },
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
              { text: '日付', alignment: 'center', style: 'tableHeader' },
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
