// src/components/Footer.styles.js
import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  padding: 1rem 2rem;  /* Adjust padding to make it more compact */
  background-color: #003366;
  color: white;
  text-align: center;
  font-size: 1rem;
  margin-top: 0;  /* Ensure there's no margin creating a gap above the footer */
  margin-bottom: 0;  /* Remove bottom margin if there's unnecessary space below */
  width: 100%;  /* Ensure footer takes up the full width of the page */
  position: relative; /* Optional: If there's any absolute positioning needed */
  box-sizing: border-box; /* Ensure padding does not affect the overall width */
`;

export const FooterText = styled.p`
  margin-bottom: 1rem;
`;

export const FooterLinks = styled.div`
  margin-top: 1rem;
  display: flex;  /* Use flex to manage space between links */
  justify-content: center;  /* Center the links horizontally */
  flex-wrap: wrap;  /* Ensure links wrap if space is tight */
`;

export const LinkItem = styled.a`
  color: #ffb400;
  text-decoration: none;
  margin: 0 1rem;
  font-weight: bold;

  &:hover {
    color: #ffffff;
  }
`;
