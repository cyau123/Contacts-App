export default function SearchResultsHeader({lastSearchTerm, filteredContacts}) {
    return (
        <h2 className='dotted-underline'>
          Results for <span style={{ color: '#e383a8' }}>"{lastSearchTerm}"</span> ({filteredContacts.length} results)
        </h2>
    )
}