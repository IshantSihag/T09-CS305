import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
async function PdfReader(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const pdfData = new Uint8Array(arrayBuffer);

        // Using pdfjs-dist to extract text from PDF
        const pdf = await pdfjs.getDocument(pdfData).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          let pageText = await page.getTextContent();
          pageText = pageText.items.map((item) => item.str).join(' ');

          text += pageText + '\n';
        }

        resolve(text);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
}


export default PdfReader

