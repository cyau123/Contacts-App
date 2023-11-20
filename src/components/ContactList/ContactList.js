import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactList.css';
import { Container, Grid, Input, Button, Icon } from 'semantic-ui-react';
import ContactListItem from '../ContactListItem/ContactListItem';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);


  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => console.error('Fetching error:', error));
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredSuggestions = contacts.filter(contact => {
        return contact.name.toLowerCase().startsWith(value) ||
               contact.name.split(" ").some(part => part.toLowerCase().startsWith(value));
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    // Function to handle clicks outside the search input and suggestions
    const handleOutsideClick = (event) => {
      const inputWrapper = document.querySelector(".input-wrapper");

      if (!inputWrapper.contains(event.target)) {
        setSuggestions([]); // Clear suggestions
      }
    };

    // Add event listener to window for clicks
    window.addEventListener("mousedown", handleOutsideClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);


  const performSearch = () => {
    if (searchTerm) {
      const filtered = contacts.filter(contact => {
        return contact.name.toLowerCase().startsWith(searchTerm) ||
               contact.name.split(" ").some(part => part.toLowerCase().startsWith(searchTerm));
      });
      setFilteredContacts(filtered);
      setLastSearchTerm(searchTerm);
      setSuggestions([]); // Clear suggestions on search
    } else {
      setFilteredContacts(null);
      setLastSearchTerm('');
    }
  };

  const handleSearchClick = () => {
    performSearch();
  };

  const handleClearClick = () => {
    setSearchTerm(''); // Clear the input field
    setFilteredContacts(null); // Clear the search results
    setLastSearchTerm('');
    setSuggestions([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); // Prevent the cursor from moving
      setFocusedSuggestionIndex(focusedSuggestionIndex < suggestions.length - 1 ? focusedSuggestionIndex + 1 : 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); // Prevent the cursor from moving
      setFocusedSuggestionIndex(focusedSuggestionIndex > 0 ? focusedSuggestionIndex - 1 : suggestions.length - 1);
    } else if (event.key === 'Enter') {
      if (focusedSuggestionIndex >= 0 && focusedSuggestionIndex < suggestions.length) {
        selectSuggestion(suggestions[focusedSuggestionIndex].name);
      } else {
        performSearch();
      }
    }
  };

  const handleMouseEnter = (index) => {
    setFocusedSuggestionIndex(index);
  };

  const handleMouseLeave = () => {
    setFocusedSuggestionIndex(-1);
  };

  const selectSuggestion = (name) => {
    setSearchTerm(name);
    setLastSearchTerm(name);

    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredContacts(filtered);
    setSuggestions([]); // Clear suggestions
  };

  return (
    <Container>
      <Grid>
        <Grid.Row className='searchbar-container'>
          <Grid.Column width='10' style={{ paddingRight: 0 }}>
            <div className="input-wrapper">
                <Input
                fluid
                placeholder='Type a name'
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                />
                {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                    <li
                        key={suggestion.id}
                        className={`suggestion-item ${index === focusedSuggestionIndex ? 'focused' : ''}`}
                        onClick={() => selectSuggestion(suggestion.name)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {suggestion.name}
                    </li>
                    ))}
                </ul>
                )}
            </div>
          </Grid.Column>
          <Grid.Column width='6' style={{ paddingLeft: 0 }}>
            <Button primary onClick={handleSearchClick}>Search <Icon name="search" style={{ marginLeft: '5px' }} /></Button>
            <Button className='reset-button' onClick={handleClearClick}>Reset <Icon name="close" style={{ marginLeft: '5px' }} /></Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {filteredContacts !== null && (
        <h2 className='dotted-underline'>
          Results for <span style={{ color: '#e383a8' }}>"{lastSearchTerm}"</span> ({filteredContacts.length} results)
        </h2>
      )}

      {(filteredContacts || contacts).map(contact => (
        <ContactListItem key={contact.id} contact={contact} />
      ))}

    </Container>
  );
}

export default ContactList;
