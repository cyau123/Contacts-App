import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactList.css';
import { Container, Grid, Input, Button, Icon, Dimmer, Loader, GridColumn } from 'semantic-ui-react';
import ContactListItem from '../ContactListItem/ContactListItem';

function ContactList() {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);


  useEffect(() => {
    // Set 1 second delay
    const timer = setTimeout(() => {
      axios.get('https://jsonplaceholder.typicode.com/users')
        .then(response => {
          setContacts(response.data);
          setIsLoading(false);
          window.scrollTo(0, 0);
        })
        .catch(error => {
          console.error('Fetching error:', error);
          setIsLoading(false);
          window.scrollTo(0, 0);
        });
    }, 1000);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timer);
  }, []);

  /* Stop showing suggestions when user clicks outside the search bar and suggestions */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const inputWrapper = document.querySelector(".input-wrapper");

      if (!inputWrapper.contains(event.target)) {
        setSuggestions([]); // Clear suggestions
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = (filteredContacts || contacts).length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  /* Show a Loader when page is loading */
  if (isLoading) {
    return (
    <Dimmer active={true} inverted={true}>
      <Loader content="Loading..." />
    </Dimmer>)
  }

  /* Search bar autocomplete - when user start typing in the text input, contacts are filtered and
     set suggestions state to filtered contacts */
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const trimmedValue = value.trim().toLowerCase();

    if (trimmedValue.length > 0) {
      const filteredSuggestions = contacts.filter(contact => {
        return contact.name.toLowerCase().startsWith(trimmedValue) ||
               contact.name.split(" ").some(part => part.toLowerCase().startsWith(trimmedValue));
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };


  /* When user clicks the search button, if there is text in the input,
     filter the contacts, and set FilteredContacts state to the filtered contacts */
  const performSearch = () => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    if (trimmedSearchTerm) {
      const filtered = contacts.filter(contact => {
        return contact.name.toLowerCase().startsWith(trimmedSearchTerm) ||
               contact.name.split(" ").some(part => part.toLowerCase().startsWith(trimmedSearchTerm));
      });
      setFilteredContacts(filtered);
      setLastSearchTerm(searchTerm);
      setSuggestions([]); // Clear suggestions on search
      setCurrentPage(1);
    } else {
      setFilteredContacts(null);
      setLastSearchTerm('');
      setCurrentPage(1);
    }
  };

  const handleSearchClick = () => performSearch();

  /* When user clicks the reset button, clear the input field,
     search results, lastSearchTerm, and suggestion contacts */
  const handleClearClick = () => {
    setSearchTerm('');
    setFilteredContacts(null);
    setLastSearchTerm('');
    setSuggestions([]);
    setCurrentPage(1);
  };

  /* Change the index of the suggestion being focused when user uses a keyboard*/
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      // Prevent the cursor from moving
      event.preventDefault();
      // Increment index by 1 if current index is less than the length of suggestions, or else go back to the first suggestion
      setFocusedSuggestionIndex(focusedSuggestionIndex < suggestions.length - 1 ? focusedSuggestionIndex + 1 : 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      // Decrement index by 1 if current focus is not the first item, or else focus back to the last item
      setFocusedSuggestionIndex(focusedSuggestionIndex > 0 ? focusedSuggestionIndex - 1 : suggestions.length - 1);
    } else if (event.key === 'Enter') {
      // if there is a focused suggestion, perform search by calling selectSuggestion with the suggested name
      if (focusedSuggestionIndex >= 0 && focusedSuggestionIndex < suggestions.length) {
        selectSuggestion(suggestions[focusedSuggestionIndex].name);
      } else {
        performSearch();
      }
    }
  };

  /* Update the focused suggestion index when the mouse enters a suggestion */
  const handleMouseEnter = (index) => {
    setFocusedSuggestionIndex(index);
  };

  /* Reset the focused suggestion index to -1 when the mouse leaves the suggestions area */
  const handleMouseLeave = () => {
    setFocusedSuggestionIndex(-1);
  };

  /* Performs a search using the given string */
  const selectSuggestion = (name) => {
    setSearchTerm(name);
    setLastSearchTerm(name);

    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().startsWith(name.toLowerCase()) ||
      contact.name.split(" ").some(part => part.toLowerCase().startsWith(name.toLowerCase()))
    );
    setFilteredContacts(filtered);
    setCurrentPage(1);
    setSuggestions([]); // Clear suggestions
  };

  /* Store the contacts of the current page to currentContacts */
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentContacts = (filteredContacts || contacts).slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  /* Function to return Page Number Buttons dynamically according to the number of search results */
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button key={i} className="page-number-button" onClick={() => setCurrentPage(i)} disabled={currentPage === i}>
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <Container>
      <Grid>
        <Grid.Row className='searchbar-container'>
          <Grid.Column mobile={10} tablet={10} computer={10} style={{ paddingRight: 0 }}>
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
          <Grid.Column mobile={6} tablet={3} computer={3} style={{ paddingLeft: 0 }}>
            <Button primary onClick={handleSearchClick}>Search <Icon name="search" style={{ marginLeft: '5px' }} /></Button>
          </Grid.Column>
          <GridColumn mobile={16} tablet={3} computer={3}>
            <Button className='reset-button' onClick={handleClearClick}>Reset <Icon name="close" style={{ marginLeft: '5px' }} /></Button>
          </GridColumn>
        </Grid.Row>
      </Grid>

      {filteredContacts !== null && (
        <h2 className='dotted-underline'>
          Results for <span style={{ color: '#e383a8' }}>"{lastSearchTerm}"</span> ({filteredContacts.length} results)
        </h2>
      )}

      {currentContacts.map(contact => (
        <ContactListItem key={contact.id} contact={contact} />
      ))}
      <Grid >
        <Grid.Row style={{marginTop: "4rem", marginBottom: "5rem"}}>
          <Grid.Column width={4} textAlign="right">
            <Button className="prev-button" onClick={handlePreviousPage} disabled={currentPage === 1}>Prev</Button>
          </Grid.Column>
          <Grid.Column width={8} textAlign="center">
            {renderPageNumbers()}
          </Grid.Column>
          <Grid.Column width={4} textAlign="left">
            <Button className="next-button" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default ContactList;