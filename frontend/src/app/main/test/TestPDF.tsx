'use client';

import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
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

type TestPDFProps = {
  //
};

const TestPDF: React.FC<TestPDFProps> = () => {
  const [openPDF, setOpenPDF] = useState<boolean>(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string>('');

  /** 同じページでPDFを開く */
  const createPDF = async (definition: TDocumentDefinitions, tableLayouts?: { [name: string]: CustomTableLayout }) => {
    return new Promise((resolve) => {
      pdfMake.createPdf(definition, tableLayouts, fonts, pdfFonts.pdfMake?.vfs).getDataUrl((value) => {
        setPdfDataUrl(value);
        resolve(value);
      });
    });
  };

  /** 別ページでPDFを開く */
  const createOpenPDF = (definition: TDocumentDefinitions, tableLayouts?: { [name: string]: CustomTableLayout }) => {
    return new Promise(() => {
      pdfMake.createPdf(definition, tableLayouts, fonts, pdfFonts.pdfMake?.vfs).open();
    });
  };

  const pdfSample = async () => {
    setOpenPDF((prev) => !prev);
    const documentDefinition: TDocumentDefinitions = {
      content: [
        {
          text: [
            'テストテストテストテストテストテストテストテストテスト\nテストテストテストテストテスト\n',
            'テスト2テスト2テスト2テスト2テスト2テスト2テスト2テスト2テスト2テスト2テスト2テスト2\nテスト2テスト2テスト2',
            { text: '\n??????????????????????????\n', fontSize: 15, bold: true },
            'テスト3テスト3テスト3テスト3テスト3テスト3テスト3テスト3テスト3テスト3テスト3テスト3テスト3\n',
            { text: 'テスト4\nテスト4\nテスト4\nテスト4\nテスト4\n', fontSize: 20 },
            {
              text: 'テスト5\nテスト5\nテスト5\nテスト5\nテスト5\n',
              italics: true,
              fontSize: 40,
            },
            'テスト6\n\n\n\n\n\n',
            'テスト7\n\n\n',
          ],
        },
      ],
      defaultStyle: {
        font: 'NotoSerifJP',
      },
    };
    // return await createOpenPDF(documentDefinition);
    return await createPDF(documentDefinition).finally();
  };

  return (
    <>
      <Box sx={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column' }}>
        <Button variant="outlined" onClick={pdfSample} sx={{ marginBottom: '1rem' }}>
          open pdf
        </Button>
        {openPDF ? <iframe title="PDF Viewer" src={pdfDataUrl} width="100%" height="800"></iframe> : <></>}
      </Box>
    </>
  );
};

export default TestPDF;
