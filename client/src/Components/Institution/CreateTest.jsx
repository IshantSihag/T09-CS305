import { useState, useEffect } from "react";

import {
  Card,
  Button,
  Typography,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  List,
  ListItem,
  ListItemPrefix,
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

const Ques_Types = ["MCQ", "Short answer", "Long answer"];

// function

export default function CreattTest() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "--",
      value: "--",
      type: "MCQ",
      choices: [
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
        { value: "", isCorrect: false },
      ],
      answer: "",
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // useEffect(() => {
  //   if (questions.length > 0) {
  //     setCurrentQuestionIndex(0);
  //   }
  // }, [questions]);

  // Function to handle adding a choice for a multiple-choice question
  const handleAddChoice = (questionId) => {
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

  const handleSelectCorrectAnswer = (questionId, choiceId, isCorrect) => {
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

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: prevQuestions.length + 1,
        title: "--",
        value: "--",
        type: "MCQ",
        choices: [{ value: "", isCorrect: false }],
        answer: "",
      },
    ]);
  };

  const handleChoiceChange = (choiceId, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex
          ? {
              ...question,
              choices: question.choices.map((choice, choiceIndex) =>
                choiceIndex === choiceId ? { ...choice, value } : choice
              ),
            }
          : question
      )
    );
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

  const handleQuestionTypeChange = (value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === currentQuestionIndex ? { ...question, type: value } : question
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
            className="flex justify-between border-b pb-2 rounded-none"
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
              >
                <div className="flex justify-between">
                  <Typography
                    variant="h6"
                    color="gray"
                    className="font-bold justify-between"
                  >
                    Q. {question.id} {question.title}
                  </Typography>
                  <Chip
                    variant="ghost"
                    color="blue"
                    value={question.type}
                    className="w-fit"
                  />
                </div>

                <Typography variant="paragraph" color="gray" className="flex-1">
                  {question.value}
                </Typography>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card className="flex-1 place-content-between h-svh">
          <CardHeader
            className=" relative z-100 flex justify-between border-b pb-2 rounded-none"
            floated={false}
            shadow={false}
          >
            <div className="w-44">
              <Select
                value={currentQuestion.type}
                onChange={(val) => handleQuestionTypeChange(val)}
              >
                <Option value="MCQ">Multiple Choice</Option>
                <Option value="short_answer">Short Answer</Option>
                <Option value="long_answer">Long</Option>
              </Select>
            </div>
            <Button
              className="rounded-full"
              size="sm"
              ripple={false}
              onClick={() => handleMoveQuestionUp()}
              disabled={currentQuestionIndex === 0}
            >
              Up
            </Button>
            <Button
              className="rounded-full"
              size="sm"
              ripple={false}
              onClick={() => handleMoveQuestionDown()}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Down
            </Button>
          </CardHeader>
          <CardBody className="flex-1 overflow-scroll">
            <div>
              <Typography className="font-medium">Question</Typography>
              {/* <Input 
                placeholder="Question Title"
                labelProps={{
                  placeholder:"Question Title",
                  style:{
                    pointerEvents: "none",
                  }
                }}
              /> */}
              <Textarea
                placeholder="Type question here"
                onChange={(e) => handleQuestionChange(e.target.value)}
                value={currentQuestion.value}
              />
            </div>
            <div>
              <Typography className="font-medium">Answers</Typography>
              <List className="w-1/2" key={currentQuestion.id}>
                {currentQuestion.choices.map((choice, index) => (
                  <ListItem className="p-0" key={choice.value}>
                    <ListItemPrefix className="mr-3">
                      <Radio
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: "p-0",
                        }}
                      />
                    </ListItemPrefix>
                    <div
                      key={choice.value}
                      className="flex-1 items-center mb-2"
                    >
                      <Input
                        label={`Enter Choice ${index + 1}`}
                        className="w-full mr-2"
                        inputProps={{ maxLength: 255 }}
                        value={choice.value}
                        onChange={(e) =>
                          handleChoiceChange(index, e.target.value)
                        }
                      />
                      {/* {currentQuestion.type === "MCQ" && (
                        <Checkbox
                          className="ml-2"
                          label="Correct"
                          checked={choice.isCorrect}
                          onChange={() =>
                            handleSelectCorrectAnswer(
                              currentQuestionIndex,
                              index,
                              !choice.isCorrect
                            )
                          }
                        />
                      )} */}
                    </div>
                    <TrashIcon
                      className="ml-2 mb-3 h-7 w-7"
                      onClick={() => {
                        handleDeleteChoice(index);
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <div className="mt-2">
                <div className="flex items-center mb-2">
                  <Button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleAddChoice(currentQuestionIndex)}
                  >
                    + Add Choice
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex-wrap-reverse py-3" divider={true}>
            <Typography className="font-medium">Marks</Typography>
            <div className="grid grid-cols-2 gap-4 w-1/2">
              <Input label="Overall *"/>
              <Input label="Negative" />
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
