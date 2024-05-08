import { useEffect, useState } from 'react';

import { notifyError } from "../UI/ToastNotification";

function TestPreview() {
    const [testData, setTestData] = useState(null);
    const [question, setQuestion] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('testData'));
        const data2 = JSON.parse(localStorage.getItem('testQuestion'));
        if (data && data2) {
            setTestData(data);
            setQuestion(data2);
        } else {
            notifyError("Error while previewing test data, Please try again");
            window.location.href = '/';
        }
    }, []);

    if (!testData) {
        return null;
    }

    return (
        <div>
            {/* Display the test data */}
            {
                testData ? (
                    <>
                    <h1>Test Name: {testData.title}</h1>
                    <h2>Description : {testData.description}</h2>
                    <h2>Instructions : {testData.instructions}</h2>
                    <div>
                        <p>Start: {String(testData.start)}</p>
                        <p>Duration: {testData.duration}</p>
                    </div>
                    <div>
                        {question.map((q, index) => (
                            <div key={index}>
                                <br/>
                                <h5>Question Title : {q.title}</h5>
                                <p>Statement : {q.statement}</p>
                                <p>Type : {q.type}</p>
                                <p>Marks : {q.marks}</p>
                                <ul className='list-disc'>
                                    {q.choices.map((choice, index) => (
                                        <li key={index} className={`${!choice.isCorrect ? 'bg-gray-500' : 'bg-green-500'}`}>{choice.value}</li>
                                    ))}
                                </ul>
                                <br/>
                            </div>
                        ))}
                    </div>
                    </>
                    ) : (
                    <div>
                        <h2>No questions found</h2>
                    </div>
                    )
            }
        </div>
    );
}

export default TestPreview;