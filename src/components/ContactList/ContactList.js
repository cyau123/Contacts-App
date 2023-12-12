import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactList.css';
import { Container, Dropdown, Grid } from 'semantic-ui-react';
import ContactListItem from '../ContactListItem/ContactListItem';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Pagination from '../Pagination/Pagination';
import SearchResultsHeader from '../SearchResultsHeader/SearchResultsHeader';
import SearchBar from '../SearchBar/SearchBar';

function ContactList() {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = (filteredContacts || contacts).length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const orderOptions = [
    { key: 'asc', text: 'Sort A-Z', value: 'asc' },
    { key: 'desc', text: 'Sort Z-A', value: 'desc' }
  ];

  useEffect(() => {
    // Set 1 second delay
    const timer = setTimeout(() => {
      axios.get('https://jsonplaceholder.typicode.com/users')
        .then(response => {
          const sortedContacts = response.data.sort((a, b) => a.name.localeCompare(b.name));
          setContacts(sortedContacts);
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

  /* Scroll to top of the page whenever visits a new page */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  /* Return contacts that match or contain the trimmedValue */
  const filterContacts = (trimmedValue) => {
    return contacts.filter(contact => {
      return contact.name.toLowerCase().startsWith(trimmedValue) ||
             contact.name.split(" ").some(part => part.toLowerCase().startsWith(trimmedValue));
    });
  };

  /* Search bar autocomplete - when user start typing in the text input, contacts are filtered and
     set suggestions state to filtered contacts */
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const trimmedValue = value.trim().toLowerCase();

    if (trimmedValue.length > 0) {
      const filteredSuggestions = filterContacts(trimmedValue);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  /* Performs a search using the given string */
  const selectSuggestion = (name) => {
    setSearchTerm(name);
    setLastSearchTerm(name);
    const filtered = filterContacts(name.toLowerCase());
    setFilteredContacts(filtered);
    setCurrentPage(1);
    setSuggestions([]); // Clear suggestions
  };

  /* When user clicks the search button, if there is text in the input,
     filter the contacts, and set FilteredContacts state to the filtered contacts */
     const performSearch = () => {
      const trimmedSearchTerm = searchTerm.trim().toLowerCase();
      if (trimmedSearchTerm) {
        const filtered = filterContacts(trimmedSearchTerm);
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

  /* When user clicks the search button, calls performSearch method */
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

  /* Change the order of the contacts if a different sort method is chosen in the dropdown*/
  const handleDropdown = (e, { value }) => {
    // a boolean which will be true if the value is 'asc'
    const ascending = value === 'asc';

    // Sort both contacts and filteredContacts
    const sortContacts = (contactsArray) => {
      return [...contactsArray].sort((a, b) =>
        ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    };

    if (contacts) {
      setContacts(sortContacts(contacts));
    }

    if (filteredContacts) {
      setFilteredContacts(sortContacts(filteredContacts));
    }

    setCurrentPage(1);
  }

  /* Show a Loader when page is loading */
  if (isLoading) {
    return (
      <LoadingComponent content="Loading..." />
    )
  }

  return (
    <Container>
      <Grid>
        <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} handleKeyDown={handleKeyDown} suggestions={suggestions} focusedSuggestionIndex={focusedSuggestionIndex} selectSuggestion={selectSuggestion} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} handleSearchClick={handleSearchClick} handleClearClick={handleClearClick} />
      </Grid>

      {filteredContacts !== null && (
        <SearchResultsHeader lastSearchTerm={lastSearchTerm} filteredContacts={filteredContacts} />
      )}

      <Dropdown
        selection
        options={orderOptions}
        defaultValue='asc'
        onChange={handleDropdown}
      />

      {currentContacts.map(contact => (
        <ContactListItem key={contact.id} contact={contact} />
      ))}
      <Grid >
        <Pagination handlePreviousPage={handlePreviousPage} handleNextPage = {handleNextPage} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </Grid>
    </Container>
  );
}

export default ContactList;