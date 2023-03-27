import React from 'react'

// styles
import "./DraftCard.css"

function DraftCard({ course }) {
    return (
        <div className="col col-lg-4 col-md-6 col-sm-12 card-holder-div">
            <div className="card" style={{ width: "15rem", overflow: "hidden" }}>
                <img src={course.imgUrl} className="card-img" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <a href={`/content_upload/${course.id}`}   className="btn btn-primary">Upload Content</a>
                </div>
            </div>
        </div>
    )
}

export default DraftCard