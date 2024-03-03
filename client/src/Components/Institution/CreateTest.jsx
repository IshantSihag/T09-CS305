import { useState, useEffect } from "react";

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

const Ques_Types = ["single_correct", "multi_correct", "long_answer"];

const SingleCorrect = ({
  currentQuestion_,
  handleAddChoice_,
  handleChoiceChange_,
  handleDeleteChoice_,
}) => {
  return (
    <div>
      <Typography variant="h6">Options</Typography>
      {currentQuestion_.choices.map((choice, index) => (
        <div className="flex content-center">
          <Radio
            name="type"
            ripple={false}
            className="flex-row"
            containerProps={{
              className: "p-0",
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
              handleSelectCorrectAnswer_(
                index,
                !choice.isCorrect
              );
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

const LongAnswer = ({
  currentQuestion_,
  handleQuestionAnswerChange_
}) => {
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
        onChange={(e) => {handleQuestionAnswerChange_(e.target.value);}}
        value={currentQuestion_.answer}
      />
    </div>
  );
};

export default function CreattTest() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "",
      value: "",
      type: "single_correct",
      choices: [
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
      ],
      answer: "",
      marks: "",
      negative_marks: "",
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // Function to handle adding a choice for a multiple-choice question

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: prevQuestions.length + 1,
        title: "",
        value: "",
        type: "single_correct",
        choices: [{ value: "", isCorrect: false }],
        answer: "",
      },
    ]);
  };

  const handleDeleteQuestion = () => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question, index) => index !== currentQuestionIndex)
    );
    setCurrentQuestionIndex(currentQuestionIndex-1)
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
        index === currentQuestionIndex ? { ...question, value } : question
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
        index === currentQuestionIndex ? { ...question, answer: value } : question
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

  const handleMoveQuestionUp = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleMoveQuestionDown = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex p-6 gap-x-2 items-center bg-gray-50">
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
              ripple={false}
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
                    Q. {index+1}{" "}
                    {question.title.size > 15
                      ? question.title.slice() + ".."
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
                className="rounded-full mx-2"
                size="sm"
                ripple={false}
                onClick={() => handleMoveQuestionUp()}
                disabled={currentQuestionIndex === 0}
              >
                Up
              </Button>
              <Button
                className="rounded-full mr-2"
                size="sm"
                ripple={false}
                onClick={() => handleMoveQuestionDown()}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Down
              </Button>
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
          <CardBody className="flex-1 overflow-scroll">
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
                value={currentQuestion.value}
              />
            </div>
            {currentQuestion.type === "single_correct" && (
              <SingleCorrect
                currentQuestion_={currentQuestion}
                currentQuestionIndex_={currentQuestionIndex}
                handleAddChoice_={handleAddChoice}
                handleDeleteChoice_={handleDeleteChoice}
                handleChoiceChange_={handleChoiceChange}
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
          <CardFooter className="flex-wrap-reverse py-3" divider={true}>
            <Typography className="font-medium">Marks</Typography>
            <div className="grid grid-cols-2 gap-4 w-1/2">
              <Input label="Overall *" onChange={(value)=>{
                setQuestions((prevQuestions) =>
                  prevQuestions.map((question, index) =>
                    index === currentQuestionIndex ? { ...question, marks: value } : question
                  )
                );
              }}/>
              <Input label="Negative" onChange={(value)=>{
                setQuestions((prevQuestions) =>
                  prevQuestions.map((question, index) =>
                    index === currentQuestionIndex ? { ...question, negative_marks: value } : question
                  )
                );
              }}/>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
