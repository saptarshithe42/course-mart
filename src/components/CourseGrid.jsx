import React from "react"

//styles
import "./CourseGrid.css"

// components
import BookCard from "./BookCard"

function CourseGrid({courseList, cardType}) {
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

export default CourseGrid