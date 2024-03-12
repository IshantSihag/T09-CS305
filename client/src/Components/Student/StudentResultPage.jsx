import React, { useState } from "react";
import Footer from "../Common/Footer";
import ScorePage from "./ScorePage";
import DetailedAnalysisPage from "./DetailedAnalysisPage";
import "./StudentResultPage.css";
import {
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";

const StudentResultPage = () => {
  const [selectedTab, setSelectedTab] = useState("score");

  return (
    <div>
      <h2 className="result-title">Result for TEST NAME</h2>

      <Tabs value={selectedTab}>
        <TabsHeader>
          <Tab value="score">Score</Tab>
          <Tab value="analysis">Detailed Analysis</Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value="score">
            <ScorePage />
          </TabPanel>
          <TabPanel value="analysis">
            <DetailedAnalysisPage />
          </TabPanel>
        </TabsBody>
      </Tabs>

      <Footer />
    </div>
  );
};

export default StudentResultPage;
