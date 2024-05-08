import { render, screen } from '@testing-library/react';
import Footer from './../../Components/Common/Footer';

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test('renders Footer', () => {
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  test('contains correct address', () => {
    const addressElement = screen.getAllByText(/IIT Ropar/);
    expect(addressElement[0]).toBeInTheDocument();
  });

  test('contains correct phone number', () => {
    const phoneElement = screen.getByText(/\+91-9817536548/);
    expect(phoneElement).toBeInTheDocument();
  });

  test('contains correct email', () => {
    const emailElement = screen.getByText(/kapil@iitrpr.com/);
    expect(emailElement).toBeInTheDocument();
  });

  test('contains correct company description', () => {
    const descriptionElement = screen.getByText(/About the company/);
    expect(descriptionElement).toBeInTheDocument();
  });
});