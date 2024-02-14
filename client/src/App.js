import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Common/HomePage";
import StudentLogin from "./Components/Student/StudentLoginPage";
import InstitutionLogin from "./Components/Institution/InstitutionLoginPage";
import StudentSignUp from "./Components/Student/StudentSignUp";
import InstitutionSignUp from "./Components/Institution/InstitutionSignUp";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/student/login" element={<StudentLogin />} />
          <Route exact path="/student/signup" element={<StudentSignUp />} />
          <Route exact path="/institution/login" element={<InstitutionLogin />} />
          <Route exact path="/institution/signup" element={<InstitutionSignUp />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
