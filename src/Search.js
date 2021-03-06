import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import * as _ from "lodash"
import * as BooksAPI from "./BooksAPI"
import Book from "./Book"

class Search extends Component {

  static propTypes = {
    onSelectShelf: PropTypes.func.isRequired,
    books: PropTypes.array.isRequired
  }

  state = {
    query: "",
    results: []
  }

  // TODO: Add book to library shelf functionality

  updateQuery = (query) => {
    const maxResults = 20
    this.setState({ query: query })

    // Get search results only if query has a length
    query.length && (
      BooksAPI.search(query, maxResults).then((res) => {
        this.setState({ results: res })
      })
    )
  }

  clearQuery = () => {
    this.setState({ query: "" })
  }

  // If a book in results is on shelf, display that book (for button UI)
  checkForShelf(searchResult) {
    const bookOnShelf = this.props.books.filter((book) => book.id === searchResult.id)
    return _.isEmpty(bookOnShelf[0]) ? searchResult : bookOnShelf[0]
  }

  renderResults() {
    const results = this.state.results

    if (results["error"] === "empty query")
      return "No matching results"
    else if (results) {
      return (
        results.map((result, index) => (
          <li key={ index }>
            <Book book={ this.checkForShelf(result) }  onSelectShelf={ this.props.onSelectShelf } />
          </li>
        ))
      )
    }
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={ this.state.query }
              onChange={(e) => this.updateQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            { this.renderResults() }
          </ol>
        </div>
      </div>
    )
  }
}

export default Search;
