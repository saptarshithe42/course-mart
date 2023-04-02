import React from "react"

// styles
import "./ReviewCard.css"

// components
import { Rating } from "react-simple-star-rating"
import formatDistanceToNow from "date-fns/formatDistanceToNow";

function ReviewCard({ review }) {
	return (
		<div className="container review-card w-75">
			<div className="review-rating container">
				<h4>{review.username}</h4>
				<div>
					<Rating
						initialValue={review.rating}
						readonly={true}
						size="1.2rem"
					/>
				</div>
				<p>{formatDistanceToNow(review.date.toDate(), { addSuffix: true })}</p>
			</div>
			<div className="review-comment">
				<p>{review.comment}</p>
			</div>
		</div>
	)
}

export default ReviewCard