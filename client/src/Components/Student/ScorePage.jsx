import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

const ScorePage = ({quesData}) => {
  const correctedPercentage = quesData.correct;
  const incorrectedPercentage = quesData.incorrect;
  const unattemptedPercentage = quesData.unattempted; 

  const totalPercentage =
    correctedPercentage + incorrectedPercentage + unattemptedPercentage;

  const correctedAngle = Math.round((correctedPercentage / totalPercentage) * 100, 2);
  const incorrectedAngle = Math.round((incorrectedPercentage / totalPercentage) * 100, 2);
  const unattemptedAngle = Math.round((unattemptedPercentage / totalPercentage) * 100, 2);
  
  const chartConfig = {
    type: "pie", 
    series: [correctedAngle, incorrectedAngle, unattemptedAngle],
    options: {
      chart: {
        width: 280,
        height: 280,
        toolbar: {
          show: false,
        },
      },
      title: {
        text: "", // No title
      },
      dataLabels: {
        enabled: false,
      },
      labels: ["Correct", "Incorrect", "Unattempted"], // Labels for the pie chart sections
      colors: ["#48BB78", "#F56565", "#aaaaaa"], // Adjust colors as needed
      legend: {
        show: false,
      },
    },
  };
  

  return (
    <div className="result-container">
      <div className="result-column">
        <div className="result-list">
          <div className="result-type">
            <strong>Correct:</strong> {correctedAngle} %
          </div>
          <div className="result-type">
            <strong>Incorrect:</strong> {incorrectedAngle} %
          </div>
          <div className="result-type">
            <strong>Unattempted:</strong> {unattemptedAngle} %
          </div>
        </div>
      </div>

      <div className="result-column">
        <Example chartConfig={chartConfig} />
      </div>
    </div>
  );
};

const Example = ({ chartConfig }) => (
  <Card>
    <CardHeader
      floated={false}
      shadow={false}
      color="transparent"
      className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
    >
    
    
    </CardHeader>
    <CardBody className="mt-4 grid place-items-center px-2">
      <Chart {...chartConfig} />
    </CardBody>
  </Card>
);

export default ScorePage;
