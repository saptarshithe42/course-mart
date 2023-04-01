import React from 'react'

// styles
import "./PurchasedCard.css"

// components
import { Rating } from 'react-simple-star-rating'

function PurchasedCard({ course }) {


    return (

        <div className="col col-lg-4 col-md-6 col-sm-12 card-holder-div purchased-card">
            <div className="card" style={{ width: "15rem", overflow: "hidden" }}>
                <img src={course.imgUrl} className="card-img" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{course.name.slice(0, 30)}...</h5>
                    <div className="card-text" style={{ fontSize: "0.7rem" }}> {
                        course.creatorList.map((creator, index) => {
                            return (<span key={index}>{creator}. </span>)
                        })
                    }</div>

                    <a 
                    className="btn btn-primary"
                    style={{marginTop : "1rem"}}
                    href={`/course_view/${course.id}`}
                    >
                    Go
                    </a>
                </div>
            </div>
        </div>

    )
}

export default PurchasedCard