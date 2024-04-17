import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Common/HomePage";
import StudentLogin from "./Components/Student/StudentLoginPage";
import InstitutionLogin from "./Components/Institution/InstitutionLoginPage";
import StudentSignUp from "./Components/Student/StudentSignUp";
import InstitutionSignUp from "./Components/Institution/InstitutionSignUp";
import InstitutionProfile from "./Components/Institution/InstitutionProfilePage";
import StudentDashBoard from "./Components/Student/StudentDashBoard";
import StudentProfilePage from "./Components/Student/StudentProfilePage";
import InstituteDashBoard from "./Components/Institution/InstituteDashBoard";
import CreateTest from "./Components/Institution/CreateTest";
import CreateTestUpload from "./Components/Institution/CreateTestUpload";
import CreateTestPreview from "./Components/Institution/CreateTestPreview";
import AttemptTest from "./Components/Student/AttemptTest";
import StartTest from "./Components/Student/StartTest";
import RegisterTest from "./Components/Student/RegisterTest";
import StudentResultPage from "./Components/Student/StudentResultPage"
import InstituteTestResult from "./Components/Institution/InstitutionTestResult";
import StudentReview from "./Components/Student/StudentReview";
import Studentinfo from "./Components/Student/Studentinfo";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/student/" element={<StudentDashBoard />} />
          <Route exact path="/student/registertest/:id" element={<RegisterTest />} />
          <Route exact path="/student/attemptest/:id" element={<AttemptTest />} />
          <Route exact path="/student/starttest/:id" element={<StartTest />} />
          <Route exact path="/student/login" element={<StudentLogin />} />
          <Route exact path="/student/signup" element={<StudentSignUp />} />
          <Route exact path="/student/profile" element={<StudentProfilePage />} />
          <Route exact path="/institution/login" element={<InstitutionLogin />} />
          <Route exact path="/institution/signup" element={<InstitutionSignUp />} />
          <Route exact path="/institution/profile" element={<InstitutionProfile />} />
          <Route exact path="/institution/" element={<InstituteDashBoard />} />
          <Route exact path="/institution/createtest" element={<CreateTest />} />
          <Route exact path="/institution/createtest/upload" element={<CreateTestUpload />} />
          <Route exact path="/institution/createtest/preview" element={<CreateTestPreview />} />
          <Route exact path="/student/result" element={<StudentResultPage />} />
          <Route exact path="/institution/testresult" element={<InstituteTestResult />} />
          <Route exact path="/student/review/:id" element={<StudentReview />} />
          <Route exact path="/student/info" element={<Studentinfo />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
