import React from "react"

import "./ReviewContainer.css"
import ReviewCard from "./ReviewCard"

function ReviewContainer({reviews}) {



  return (
    <div className="review-container">
        {reviews.map((review, index) => {

            return (<ReviewCard review={review} key={index} />)
        })}
    </div>
  )
}

export default ReviewContainer