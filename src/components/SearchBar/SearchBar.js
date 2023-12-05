import { Button, Grid, Icon, Input } from "semantic-ui-react";
import "./SearchBar.css";

export default function SearchBar({searchTerm, handleSearchChange, handleKeyDown, suggestions, focusedSuggestionIndex, selectSuggestion, handleMouseEnter, handleMouseLeave, handleSearchClick, handleClearClick}) {
    return (
        <Grid.Row className='searchbar-container'>
          <Grid.Column className="input-column" mobile={16} tablet={10} computer={10} style={{ paddingRight: 0 }}>
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
          <Grid.Column mobile={8} tablet={3} computer={3} style={{ paddingLeft: 0, paddingRight:0}}>
            <Button className="search-button" primary onClick={handleSearchClick}>Search <Icon name="search" style={{ marginLeft: '5px' }} /></Button>
          </Grid.Column>
          <Grid.Column className="reset-button-column" mobile={8} tablet={3} computer={3} >
            <Button className='reset-button' onClick={handleClearClick}>Reset <Icon name="close" style={{ marginLeft: '5px' }} /></Button>
          </Grid.Column>
        </Grid.Row>
    )
}