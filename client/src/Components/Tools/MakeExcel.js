import React from 'react';
import * as XLSX from 'xlsx';

const DownloadAsExcel = ({ data }) => {
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    // Generate a unique name for the Excel file
    const currentDateTime = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const fileName = `Data_${currentDateTime}.xlsx`;

    // Save the file using Blob
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div>
      {data.length > 0 ? (
        <button onClick={downloadExcel}>Download Data as Excel</button>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default DownloadAsExcel;
