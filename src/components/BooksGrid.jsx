import React from "react"

//styles
import "./BooksGrid.css"

// components
import BookCard from "./BookCard"

function BooksGrid({bookList}) {
  return (
    <div className="book-grid-holder container">

      <div className="book-grid row justify-content-center">
        {bookList.map((book, index) => {
          return (<BookCard book={book} key={index} />)
        })}
      </div>
    </div>
  )
}

export default BooksGrid