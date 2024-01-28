'use client';

import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { useGeneratePDF } from '@/app/_util/generatePDF/useGeneratePDF';

type TestPDFProps = {
  //
};

const TestPDF: React.FC<TestPDFProps> = () => {
  const [openPDF, setOpenPDF] = useState<boolean>(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string>('');

  const { createPDF, createOpenPDF } = useGeneratePDF();

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
    // return await createOpenPDF(documentDefinition).finally();
    return await createPDF(setPdfDataUrl, documentDefinition).finally();
  };

  console.log(pdfDataUrl);
  return (
    <>
      <Box sx={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column' }}>
        <Button variant="outlined" onClick={pdfSample} sx={{ marginBottom: '1rem' }}>
          open pdf
        </Button>
        {openPDF ? <iframe title="PDF Viewer" src={pdfDataUrl} width="100%" height="800"></iframe> : <></>}
        {/* {openPDF ? <object data="pdfSample" type="application/pdf" width="100%" height="800"></object> : <></>} */}
      </Box>
    </>
  );
};

export default TestPDF;
