import { Button, Grid } from "semantic-ui-react";
import './Pagination.css'

export default function Pagination ({handlePreviousPage, handleNextPage, currentPage, totalPages, setCurrentPage}) {

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
    )
}