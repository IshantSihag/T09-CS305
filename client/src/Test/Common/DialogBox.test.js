import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import DialogBox from './../../Components/Common/DialogBox';

describe('DialogBox', () => {
  const dialogBtnText = 'Register Test';
  const dialogHeading = 'Enter Test Code';
  const dialogText = 'Please enter the test code below:';
  const notifyError = jest.fn();

  beforeEach(() => {
    render(
      <Router>
        <DialogBox
          dialogBtnText={dialogBtnText}
          dialogHeading={dialogHeading}
          dialogText={dialogText}
          notifyError={notifyError}
        />
      </Router>
    );
  });

  test('renders DialogBox', () => {
    const button = screen.getByText(dialogBtnText);
    expect(button).toBeInTheDocument();
  });

  test('opens dialog when button is clicked', () => {
    const button = screen.getByText(dialogBtnText);
    fireEvent.click(button);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  test('enters test code', () => {
    const button = screen.getByText(dialogBtnText);
    fireEvent.click(button);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1234' } });
    expect(input.value).toBe('1234');
  });
});