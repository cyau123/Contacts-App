import React, { useState, useEffect } from "react";
import './App.css';
import ContactList from './components/ContactList/ContactList';
import NavBar from './components/NavBar/NavBar';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import { FaArrowUp } from 'react-icons/fa';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  // Function to toggle visibility of the scroll-to-top-button
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ContactList />
      </Container>
      {isVisible && (
        <button onClick={scrollToTop} className="scroll-to-top-button">
          <FaArrowUp />
        </button>
      )}
    </>
  );
}

export default App;
