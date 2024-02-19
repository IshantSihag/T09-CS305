import React from 'react';
import jsPDF from 'jspdf';
function downloadTextFile(textContent, fileName) {
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

   
    link.download = fileName;

    
    document.body.appendChild(link);
    link.click();

    
    document.body.removeChild(link);
}


function downloadPdf(textContent,fileName) {
    const pdf = new jsPDF({
        orientation: 'p',  
        unit: 'mm',        
        format: 'a4',      
    });

   
    pdf.setFontSize(12);
    pdf.setFont('helvetica');

    // Calculate text lines based on width and height of the PDF
    const lines = pdf.splitTextToSize(textContent, 190);  // Adjust width as needed

    // Add text to the PDF
    pdf.text(10, 10, lines);

    // Save the PDF as a file
    pdf.save(fileName);
}
export { downloadTextFile, downloadPdf }