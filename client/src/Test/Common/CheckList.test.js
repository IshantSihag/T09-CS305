import { render, screen, fireEvent } from '@testing-library/react';
import CheckList from '../../Components/Common/CheckList';

describe('CheckList', () => {
  const userQuestions = [
    {
      options: ['Option 1', 'Option 2', 'Option 3'],
      answerList: [0, 2], // Indices of the correct answers
    },
    // More questions...
  ];
  const currentQuestion = 1;
  const handleOptionClick = jest.fn();

  beforeEach(() => {
    render(
      <CheckList
        userQuestions={userQuestions}
        currentQuestion={currentQuestion}
        handleOptionClick={handleOptionClick}
      />
    );
  });

  test('renders CheckList', () => {
    const checklist = screen.getAllByRole('checkbox');
    expect(checklist[0]).toBeInTheDocument();
  });

  test('renders correct number of checkboxes', () => {
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(userQuestions[currentQuestion - 1].options.length);
  });

  test('checks correct checkboxes', () => {
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox, index) => {
      expect(checkbox.checked).toEqual(userQuestions[currentQuestion - 1].answerList.includes(index));
    });
  });

  test('calls handleOptionClick when checkbox is clicked', () => {
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(handleOptionClick).toHaveBeenCalled();
  });
});