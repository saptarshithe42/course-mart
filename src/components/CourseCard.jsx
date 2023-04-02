import React from 'react'

// styles
import "./CourseCard.css"

// components
import { Rating } from 'react-simple-star-rating'

function CourseCard({ course }) {


    return (

        <div className="col col-lg-4 col-md-6 col-sm-12 card-holder-div course-card">
            <a href={`/course_details/${course.id}`}>
                <div className="card" style={{ width: "15rem", overflow: "hidden" }}>
                    <img src={course.imgUrl} className="card-img" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{course.name.slice(0, 30)}...</h5>
                        <div className="card-text" style={{ fontSize: "0.7rem" }}> {
                            course.creatorList.map((creator, index) => {
                                return (<span key={index}>{creator}. </span>)
                            })
                        }</div>

                        <div className="card-text rating-div" style={{ fontSize: "1rem" }}>
                            <div>{Math.round(course.avgRating * 10) / 10}</div>
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
                    </div>
                </div>
            </a>
        </div>

    )
}

export default CourseCard