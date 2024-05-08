import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './../../Components/Common/HomePage';
import Navbar from '../../Components/Common/Navbar';
import Footer from '../../Components/Common/Footer';

describe('HomePage', () => {
    beforeEach(() => {
        render(
            <Router>
                <HomePage />
            </Router>
        );
    });

    test('renders HomePage', () => {
        const homePageElement = screen.getAllByRole('heading');
        expect(homePageElement[0]).toBeInTheDocument();
    });

    // test('renders Navbar', () => {
    //     const { navbarElement } = render(
    //         <Router>
    //             <Navbar />
    //         </Router>
    //     );
    //     expect(navbarElement).toBeInTheDocument();
    // });

    test('contains correct heading', () => {
        const headingElement = screen.getByText(/Connecting Talent with ProctorX/);
        expect(headingElement).toBeInTheDocument();
    });

    test('contains correct description', () => {
        const descriptionElement = screen.getAllByText(/Explore opportunities from across the globe to learn, connect and grow. Secure and smooth tests like none other./);
        expect(descriptionElement[0]).toBeInTheDocument();
    });

    test('contains Learn more button', () => {
        const buttonElement = screen.getByText(/Learn more/);
        expect(buttonElement).toBeInTheDocument();
    });

    test('contains client logos', () => {
        const clientLogoElements = screen.getAllByRole('img');
        expect(clientLogoElements.length).toBeGreaterThan(4); // Adjust this number based on the number of logos you expect
    });

    test('renders Footer', () => {
        const footerElement = screen.getByRole('contentinfo');
        expect(footerElement).toBeInTheDocument();
    });
});