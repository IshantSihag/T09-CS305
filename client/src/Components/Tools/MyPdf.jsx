import React from 'react';
import html2pdf from 'html2pdf.js';

const generatePDF = () => {
    const content = document.getElementById('content-to-pdf');

    html2pdf(content);
};

const MyPDFComponent = () => (
    <div>
        <h1>My PDF Content</h1>
        <div id="content-to-pdf">

            <h1>This is a paragraph in the PDF.</h1>
        </div>
        <button onClick={generatePDF}>Generate PDF</button>
    </div>
);

export default MyPDFComponent;
