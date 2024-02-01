import * as pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { CustomTableLayout, TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  NotoSerifJP: {
    normal: 'https://fonts.gstatic.com/s/notoserifjp/v21/xn7mYHs72GKoTvER4Gn3b5eMXNikYkY0T84.otf',
    bold: 'https://fonts.gstatic.com/s/notoserifjp/v21/xn77YHs72GKoTvER4Gn3b5eMZGKLRkgfU8fEwb0.otf',
    italics: 'https://fonts.gstatic.com/s/notoserifjp/v21/xn7mYHs72GKoTvER4Gn3b5eMXNikYkY0T84.otf',
    bolditalics: 'https://fonts.gstatic.com/s/notoserifjp/v21/xn77YHs72GKoTvER4Gn3b5eMZGKLRkgfU8fEwb0.otf',
  },
};

/**
 * PDFを作成するためのutil
 * @returns
 */
export const useGeneratePDF = () => {
  /** 同じページでPDFを開く */
  const createPDF = async (
    setPdfDataUrl: React.Dispatch<React.SetStateAction<string>>,
    definition: TDocumentDefinitions,
    tableLayouts?: { [name: string]: CustomTableLayout },
  ) => {
    return new Promise((resolve) => {
      pdfMake.createPdf(definition, tableLayouts, fonts, pdfFonts.pdfMake?.vfs).getDataUrl((value) => {
        setPdfDataUrl(value);
        resolve(value);
      });
    });
  };

  /** 別ページでPDFを開く */
  const createOpenPDF = (
    definition: TDocumentDefinitions | undefined,
    tableLayouts?: { [name: string]: CustomTableLayout },
  ) => {
    return new Promise(() => {
      if (definition) {
        return pdfMake.createPdf(definition, tableLayouts, fonts, pdfFonts.pdfMake?.vfs).open();
      }
    });
  };

  return {
    createPDF,
    createOpenPDF,
  };
};

// frontend\src\app\main\test\TestPDF.tsx ここに使い方のサンプルがある
