import React, { useState, useEffect } from "react";
import Footer from "../Common/Footer";
import ScorePage from "./ScorePage";
import DetailedAnalysisPage from "./DetailedAnalysisPage";
import "./StudentResultPage.css";
import fetchAPI from '../Tools/FetchAPI'
import {
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";

let api = `http://localhost:8000/api`
const StudentResultPage = () => {
  const [selectedTab, setSelectedTab] = useState("score");
  const [testid, setTestId] = useState('')
  useEffect(() => {
    const fetchResult = async () => {
      let response = await fetchAPI(`${api}/student/getResultForTest?test_id=${testid}`, {}, "GET", false)
      if (response.ok) {
        // use response according to the data
        console.log(response)
      }
      else {
        // throw error accordingly
      }
    }
  }, [])
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
