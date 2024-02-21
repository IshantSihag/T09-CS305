import React from 'react';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Footer = () => {
  return (
    <div>
          <footer class="footer-distributed">
            <div class="footer-left">
              <h3>
                ProctorX
              </h3>

              <p class="footer-links">
                <a href="https://www.iitrpr.ac.in/" class="link-1">
                  Indian Institute of technology, Ropar
                </a>
              </p>

              <p class="footer-company-name">
                @2024 IIT Ropar
              </p>
            </div>

            <div class="footer-center">
              <div>
                <i class="fas fa-building"></i>
                <p>
                  <span>IIT Ropar</span>Rupnagar, Punjab, INDIA 140001
                </p>
              </div>

              <div>
                <i class="fas fa-phone-alt fa-flip-horizontal"></i>
                <p>+91-9817536548</p>
              </div>

              <div>
                <i class="far fa-envelope"></i>
                <p>
                  <a href="mailto:support@company.com">kapil@iitrpr.com</a>
                </p>
              </div>
            </div>

            <div class="footer-right">
              <p class="footer-company-about">
                <span>About the company</span>
                Explore opportunities from across the globe to learn, connect and grow. Secure and smooth tests like none other.
              </p>

              <div class="footer-icons">
                <a href="https://twitter.com/?lang=en">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="https://www.linkedin.com/school/iitropar/">
                  <i class="fab fa-linkedin"></i>
                </a>
                <a href="https://www.instagram.com/iitrpr_iitrpr/">
                  <i class="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </footer>
          </div>
  );
}

export default Footer;
