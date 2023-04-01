import React from 'react'

// styles
import "./PublishedCard.css"

// components
import { Rating } from 'react-simple-star-rating'

function PublishedCard({ course }) {


    return (

        <div className="col col-lg-4 col-md-6 col-sm-12 card-holder-div published-card">
            <div className="card" style={{ width: "15rem", overflow: "hidden" }}>
                <img src={course.imgUrl} className="card-img" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{course.name.slice(0, 30)}...</h5>
                    <div className="card-text" style={{ fontSize: "0.7rem" }}> {
                        course.creatorList.map((creator, index) => {
                            return (<span key={index}>{creator}. </span>)
                        })
                    }</div>

                    <div className="card-text rating-div" style={{fontSize : "1rem"}}>
                    <div>{course.avgRating}</div>
                        <div>
                            <Rating initialValue={course.avgRating}
                                allowFraction="true"
                                readonly="true"
                                size="1.5rem"
                            />
                        </div>
                        <div>({course.ratedCount}) </div>
                    </div>
                    <div className="card-text">
                        Rs {course.price}
                    </div>
                    <a className="btn btn-primary"
                    href={`/course_details/${course.id}`}
                    >View</a>
                </div>
            </div>
        </div>

    )
}

export default PublishedCard