import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import {
  Card,
  Button,
  Typography,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Radio,
  Textarea,
  Select,
  Option,
  Chip,
  Checkbox,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";

import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { useNavigate } from "react-router-dom";

const Ques_Types = ["single_correct", "multi_correct", "long_answer"];

const SingleCorrect = ({
  currentQuestion_,
  handleAddChoice_,
  handleChoiceChange_,
  handleDeleteChoice_,
  handleSelectCorrectAnswer_,
}) => {
  return (
    <div>
      <Typography variant="h6">Options</Typography>
      <div>
        {currentQuestion_.choices.map((choice, index) => (
          <div className="flex content-center">
            <input
              type="radio"
              name="singleChoice"
              className="m-1.5 p-1.5 border-1 w-4 border-blue-gray-100 rounded-md"
              onChange={() => {
                handleSelectCorrectAnswer_(index, true);
                currentQuestion_.choices.map((choice, i) => {
                  if (i !== index) {
                    handleSelectCorrectAnswer_(i, false);
                  }
                });
              }}
            />
            <input
              placeholder={`Enter Choice ${index + 1}`}
              className="w-1/3 m-1.5 p-1.5 border-1 border-blue-gray-100 rounded-md"
              value={choice.value}
              onChange={(e) => {
                handleChoiceChange_(index, e.target.value);
              }}
            />
            <TrashIcon
              className="mt-2.5 h-7 w-7 cursor-pointer"
              onClick={() => {
                handleDeleteChoice_(index);
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2">
        <div className="flex items-center mb-2">
          <Button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => handleAddChoice_()}
          >
            + Add Choice
          </Button>
        </div>
      </div>
    </div>
  );
};

const MultiCorrect = ({
  currentQuestion_,
  handleAddChoice_,
  handleChoiceChange_,
  handleDeleteChoice_,
  handleSelectCorrectAnswer_,
}) => {
  return (
    <div>
      <Typography variant="h6">Options</Typography>
      {currentQuestion_.choices.map((choice, index) => (
        <div className="flex content-center">
          <Checkbox
            // icon={}
            color="red"
            checked={choice.isCorrect}
            onChange={() => {
              handleSelectCorrectAnswer_(index, !choice.isCorrect);
            }}
          />
          <input
            placeholder={`Enter Choice ${index + 1}`}
            className="w-1/3 m-1.5 p-1.5 border-1 border-blue-gray-100 rounded-md"
            value={choice.value}
            onChange={(e) => {
              handleChoiceChange_(index, e.target.value);
            }}
          />
          <TrashIcon
            className="mt-2.5 h-7 w-7 cursor-pointer"
            onClick={() => {
              handleDeleteChoice_(index);
            }}
          />
        </div>
      ))}
      <div className="mt-2">
        <div className="flex items-center mb-2">
          <Button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => handleAddChoice_()}
          >
            + Add Choice
          </Button>
        </div>
      </div>
    </div>
  );
};

const LongAnswer = ({ currentQuestion_, handleQuestionAnswerChange_ }) => {
  return (
    <div>
      <Typography variant="h6">Answer</Typography>
      <Textarea
        variant="outlined"
        placeholder="Type answer here"
        // label="question"
        className="mt-2 border-1 flex-1 rounded-lg w-full h-32"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        containerProps={{
          className: "border-black",
        }}
        onChange={(e) => {
          handleQuestionAnswerChange_(e.target.value);
        }}
        value={currentQuestion_.answer}
      />
    </div>
  );
};

export default function CreattTest() {
  const navigate = useNavigate();
  let date = new Date();
  const [testData, setTestData] = useState({ title: "", start: "", duration: "" });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "",
      statement: "",
      type: "single_correct",
      choices: [
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
      ],
      answer: "",
      marks: "",
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    let access = Cookies.get("access");
    if (!access) {
      window.location.href = "/institution/login";
    }
    const questions_ = Cookies.get("questions");
    const currentQuestionIndex_ = Cookies.get("currentQuestionIndex");
    const testData_ = Cookies.get("testData");

    if (questions_ && currentQuestionIndex_) {
      // console.log("Setting questions from cookies");
      setTestData(JSON.parse(testData_));
      setQuestions(JSON.parse(questions_));
      setCurrentQuestionIndex(JSON.parse(currentQuestionIndex_));
    }
  }, []);

  setInterval(() => {
    setCookies();
  }, 10000);

  const handleSave = async() => {
    // console.log(questions);
    let access = Cookies.get("access");
    // console.log("access", access);
    
    const sendData = new FormData();
    sendData.append("title", testData.title);
    sendData.append("start", testData.start);
    sendData.append("duration", testData.duration);
    sendData.append("questions", JSON.stringify(questions));

    // console.log(sendData);
    // try{
      const res = await fetch("http://localhost:8000/createTest/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
        },
        body: sendData,
      })

      console.log("RES : ", res);
      const data = await res.json();
      console.log("data : ", data);
    // } catch (err) {
      // console.log("Failed to create test. error:", err);
    // }

  };

  const setCookies = () => {
    // console.log("Setting cookies");
    Cookies.set("testData", JSON.stringify(testData));
    Cookies.set("questions", JSON.stringify(questions));
    Cookies.set("currentQuestionIndex", JSON.stringify(currentQuestionIndex));
  };

  const deleteCookies = () => {
    Cookies.remove("testData");
    Cookies.remove("questions");
    Cookies.remove("currentQuestionIndex");
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: prevQuestions.length + 1,
        title: "",
        statement: "",
        type: "single_correct",
        choices: [
          { value: "", isCorrect: false },
          { value: "", isCorrect: false },
        ],
        answer: "",
        marks: "",
      },
    ]);
  };

  const handleDeleteQuestion = () => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question, index) => index !== currentQuestionIndex)
    );
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleQuestionTitleChange = (value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? { ...question, title: value }
          : question
      )
    );
  };

  const handleQuestionChange = (value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? { ...question, statement: value }
          : question
      )
    );
  };

  const handleQuestionTypeChange = (value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex ? { ...question, type: value } : question
      )
    );
  };

  const handleQuestionAnswerChange = (value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? { ...question, answer: value }
          : question
      )
    );
  };

  const handleAddChoice = () => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? {
              ...question,
              choices: [...question.choices, { value: "", isCorrect: false }],
            }
          : question
      )
    );
  };

  const handleChoiceChange = (choiceId, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? {
              ...question,
              choices: question.choices.map((choice, index) =>
                index === choiceId ? { ...choice, value } : choice
              ),
            }
          : question
      )
    );
  };

  const handleDeleteChoice = (choiceId) => {
    if (questions[currentQuestionIndex].choices.length === 2) {
      return;
    }
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? {
              ...question,
              choices: question.choices.filter((choice, i) => i !== choiceId),
            }
          : question
      )
    );
  };

  const handleSelectCorrectAnswer = (choiceId, isCorrect) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? {
              ...question,
              choices: question.choices.map((choice, choiceIndex) =>
                choiceIndex === choiceId ? { ...choice, isCorrect } : choice
              ),
            }
          : question
      )
    );
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 flex px-6 py-2 h-full">
        <div className="flex w-1/2 gap-x-4 h-full">
          <Typography variant="h3" color="blue-gray" className="text-center">
            Test
          </Typography>
          <input
            type="text"
            placeholder="Test Title"
            className="w-1/4 p-1.5 border-1 border-blue-gray-100 rounded-md"
            value={testData.title}
            onChange={(e) => setTestData({ ...testData, title: e.target.value })}
          />
        </div>
        <div className="flex w-1/2">
          <div className="flex w-full gap-x-4 h-full">
            <Typography
              variant="h6"
              color="blue-gray"
              className="pt-2 align-middle"
            >
              Start Time
            </Typography>
            <input
              type="datetime-local"
              min={date.toISOString().slice(0, 16)}
              placeholder="Start Time"
              className="w-fit p-1.5 border-1 border-blue-gray-100 rounded-md"
              value={testData.start}
              onChange={(e) => setTestData({ ...testData, start: e.target.value.slice(0, 16) + ":00"})}
            />
          </div>
          <div className="flex w-full gap-x-4 h-full">
            <Typography
              variant="h6"
              color="blue-gray"
              className="pt-2 align-middle"
            >
              Duration
            </Typography>
            <input
              type="number"
              placeholder="Duration in min"
              className="w-fit p-1.5 border-1 border-blue-gray-100 rounded-md"
              value={testData.duration / 60}
              onChange={(e) =>
                setTestData({ ...testData, duration: e.target.value * 60 })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex p-6 pt-1 gap-x-2 items-center bg-gray-50">
        <Card className="w-96 h-svh">
          <CardHeader
            className="flex justify-between border-b-2 mx-0 px-4 pb-2 rounded-none"
            floated={false}
            shadow={false}
          >
            <Typography variant="h5" color="blue-gray" className="self-center">
              Questions:
            </Typography>
            <Button
              className="rounded-full"
              size="sm"
              onClick={handleAddQuestion}
            >
              Add
            </Button>
          </CardHeader>
          <CardBody className="flex-1 grid auto-rows-min gap-y-2">
            {questions.map((question, index) => (
              <div
                className={`p-2 border rounded-lg ${
                  index === currentQuestionIndex ? "bg-blue-100" : ""
                }`}
                key={question.id}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                }}
              >
                <div className="flex justify-between">
                  <Typography
                    variant="h6"
                    color="gray"
                    className="font-bold justify-between"
                  >
                    Q. {index + 1}{" "}
                    {question.title.length > 13
                      ? question.title.slice(0, 13) + "..."
                      : question.title}
                  </Typography>
                  <Chip
                    variant="ghost"
                    color="blue"
                    value={question.type}
                    className="w-fit h-8"
                  />
                </div>

                {/* <Typography variant="paragraph" color="gray" className="flex-1">
                  {question.value}
                </Typography> */}
              </div>
            ))}
          </CardBody>
        </Card>
        <Card className="flex-1 place-content-between h-svh">
          <CardHeader
            className="flex justify-between border-b-2 px-4 mx-0 pb-2 mt-3 rounded-none overflow-visible"
            floated={false}
            shadow={false}
          >
            <div className="w-44">
              <Select
                size="md"
                value={currentQuestion.type}
                onChange={(val) => handleQuestionTypeChange(val)}
                labelProps={{ className: "before:content-none" }}
              >
                <Option value="single_correct" className="mb-1">
                  Single Correct (MCQ)
                </Option>
                <Option value="multi_correct" className="mb-1">
                  Multi Correct
                </Option>
                <Option value="long_answer" className="mb-1">
                  Long Answer
                </Option>
              </Select>
            </div>
            <div>
              <Button
                className="rounded-full"
                size="sm"
                ripple={false}
                onClick={() => handleDeleteQuestion()}
                disabled={currentQuestionIndex === 0}
              >
                Delete
              </Button>
            </div>
          </CardHeader>
          <CardBody className="flex-1 overflow-auto">
            <div>
              <Typography variant="h6">Question</Typography>
              <input
                placeholder="Question Title"
                className="w-1/3 p-1.5 border-1 border-blue-gray-100 rounded-md"
                value={currentQuestion.title}
                onChange={(e) => handleQuestionTitleChange(e.target.value)}
              />
              <Textarea
                variant="outlined"
                placeholder="Type question here"
                // label="question"
                className="mt-2 border-1 flex-1 rounded-lg w-full h-32"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "border-black",
                }}
                onChange={(e) => handleQuestionChange(e.target.value)}
                value={currentQuestion.statement}
              />
            </div>
            {currentQuestion.type === "single_correct" && (
              <SingleCorrect
                currentQuestion_={currentQuestion}
                currentQuestionIndex_={currentQuestionIndex}
                handleAddChoice_={handleAddChoice}
                handleDeleteChoice_={handleDeleteChoice}
                handleChoiceChange_={handleChoiceChange}
                handleSelectCorrectAnswer_={handleSelectCorrectAnswer}
              />
            )}

            {currentQuestion.type === "multi_correct" && (
              <MultiCorrect
                currentQuestion_={currentQuestion}
                currentQuestionIndex_={currentQuestionIndex}
                handleAddChoice_={handleAddChoice}
                handleDeleteChoice_={handleDeleteChoice}
                handleChoiceChange_={handleChoiceChange}
                handleSelectCorrectAnswer_={handleSelectCorrectAnswer}
              />
            )}

            {currentQuestion.type === "long_answer" && (
              <LongAnswer
                currentQuestion_={currentQuestion}
                handleQuestionAnswerChange_={handleQuestionAnswerChange}
              />
            )}
          </CardBody>
          <CardFooter className="flex-wrap-reverse py-2" divider={true}>
            <div className="flex justify-between">
              <div className="flex gap-x-2">
                <Typography className="ml-2 font-medium">
                  Marks <span className="text-red-600">*</span>
                </Typography>
                <input
                  type="number"
                  placeholder="Marks"
                  min={1}
                  className="w-fit p-1.5 border-1 border-blue-gray-100 rounded-md"
                  value={currentQuestion.marks}
                  onChange={(e) => {
                    setQuestions((prevQuestions) =>
                      prevQuestions.map((question, index) =>
                        index === currentQuestionIndex
                          ? { ...question, marks: parseInt(e.target.value) }
                          : question
                      )
                    );
                  }}
                />
              </div>
              <Button
                className="rounded-full h-9 justify-self-end"
                size="sm"
                onClick={() => {
                  handleSave();
                  navigate("/institution/");
                }}
              >
                Save
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
