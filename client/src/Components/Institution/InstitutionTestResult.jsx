import React, { useState, useEffect } from 'react';

const InstituteTestResult = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'John', marks: 85 },
    { id: 2, name: 'Alice', marks: 90 },
    { id: 3, name: 'Bob', marks: 75 },
    { id: 4, name: 'Eve', marks: 88 },
    { id: 5, name: 'Charlie', marks: 92 },
  ]);
  const [mean, setMean] = useState(0);
  const [median, setMedian] = useState(0);
  const [mode, setMode] = useState(0);
  const [highestScorer, setHighestScorer] = useState({});
  const [aboveAverageCount, setAboveAverageCount] = useState(0);
  const [belowAverageCount, setBelowAverageCount] = useState(0);

  useEffect(() => {
    calculateMean(students);
    calculateMedian(students);
    calculateMode(students);
    findHighestScorer(students);
    countAboveBelowAverage(students);
  }, [students]);

  // Calculate Mean
  const calculateMean = (data) => {
    const totalMarks = data.reduce((acc, curr) => acc + curr.marks, 0);
    const meanValue = totalMarks / data.length;
    setMean(meanValue.toFixed(2));
  };

  // Calculate Median
  const calculateMedian = (data) => {
    const sortedMarks = data.map((student) => student.marks).sort((a, b) => a - b);
    const mid = Math.floor(sortedMarks.length / 2);
    const medianValue =
      sortedMarks.length % 2 !== 0 ? sortedMarks[mid] : (sortedMarks[mid - 1] + sortedMarks[mid]) / 2;
    setMedian(medianValue.toFixed(2));
  };

  // Calculate Mode
  const calculateMode = (data) => {
    const counts = {};
    data.forEach((student) => {
      counts[student.marks] = (counts[student.marks] || 0) + 1;
    });
    const modeValue = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
    setMode(modeValue);
  };

  // Find Highest Scorer
  const findHighestScorer = (data) => {
    const highest = data.reduce((prev, current) => (prev.marks > current.marks ? prev : current), {});
    setHighestScorer(highest);
  };

  // Count Above and Below Average
  const countAboveBelowAverage = (data) => {
    const aboveAverage = data.filter((student) => student.marks > mean).length;
    const belowAverage = data.length - aboveAverage;
    setAboveAverageCount(aboveAverage);
    setBelowAverageCount(belowAverage);
  };

  return (
    <div className="container mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Student Marks</h1>
      <table className="w-full mb-8">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Marks
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="border px-6 py-4">{student.name}</td>
              <td className="border px-6 py-4">{student.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-sm font-medium">Mean:</p>
          <p className="text-lg font-semibold">{mean}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Median:</p>
          <p className="text-lg font-semibold">{median}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Mode:</p>
          <p className="text-lg font-semibold">{mode}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Highest Scorer:</p>
        <p className="text-lg font-semibold">{highestScorer.name} - {highestScorer.marks}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">Students above Average:</p>
        <p className="text-lg font-semibold">{aboveAverageCount}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Students below Average:</p>
        <p className="text-lg font-semibold">{belowAverageCount}</p>
      </div>
    </div>
  );
};

export default InstituteTestResult
