import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactList.css';

function App() {
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
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredSuggestions = contacts.filter(contact =>
        contact.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit the number of suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const performSearch = () => {
    if (searchTerm) {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
    <div className="App">
      <h1>Contacts</h1>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearchClick}>
        Search
      </button>
      {suggestions.length > 0 && (
        <ul>
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
      {filteredContacts !== null && (
        <h2>
          The results of "{lastSearchTerm}": {filteredContacts.length}
        </h2>
      )}
      <ul>
        {(filteredContacts || contacts).map(contact => (
          <li key={contact.id}>
            {contact.name} - {contact.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
