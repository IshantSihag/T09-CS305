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
import Navbar from "../Common/Navbar"; 
import { useParams } from "react-router-dom";

let api = `http://localhost:8000`
const StudentResultPage = () => {
  const {id:testid}=useParams();
  const [selectedTab, setSelectedTab] = useState("score");
  const [questions,setQuestions]=useState([])
  
  const [quesData, setQuesData] = useState({
    correct: 0,
    incorrect: 0,
    unattempted: 0,
  });

  const [testName, setTestName] = useState("");
  
  useEffect(() => {
    const fetchResult = async () => {
      let response = await fetchAPI(`${api}/student/getResultForTest?test_id=${testid}`, {email:"none"}, "GET",true)
      if (response.ok) {
        // use response according to the data
        
        // console.log(response.questionwise_score)
        setQuestions(response.questionwise_score)
        
        setQuesData({
          correct: response.correct,
          incorrect: response.incorrect,
          unattempted: response.unattempted,
        })

        setTestName(response.title);
      }
      else {
        // throw error accordingly
      }
    }
    fetchResult()
  }, [])
  return (
    <>
    <Navbar />
    <div>
      <h2 className="result-title">Result for {testName}</h2>

      <Tabs value={selectedTab}>
        <TabsHeader>
          <Tab value="score">Score</Tab>
          <Tab value="analysis">Detailed Analysis</Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value="score">
            <ScorePage quesData={quesData}/>
          </TabPanel>
          <TabPanel value="analysis">
            {questions.length>0 && <DetailedAnalysisPage questions={questions} />}
          </TabPanel>
        </TabsBody>
      </Tabs>

      <Footer />
    </div>
    </>
  );
};

export default StudentResultPage;
