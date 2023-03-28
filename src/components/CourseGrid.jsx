import React from "react"

//styles
import "./CourseGrid.css"

// components
import CourseCard from "./CourseCard"
import DraftCard from "./DraftCard"
import PublishedCard from "./PublishedCard"

function CourseGrid({courseList, cardType}) {
  return (
    <div className="book-grid-holder container">

      <div className="book-grid row justify-content-center">
        {courseList.map((course, index) => {
          if(cardType === "draft")
            return (<DraftCard course={course} key={index} />)
          else if (cardType === "course")
            return (<CourseCard course={course} key={index}  />)
          else if(cardType === "published")
            return <PublishedCard course={course} key={index}  />
        })}
      </div>
    </div>
  )
}

export default CourseGrid