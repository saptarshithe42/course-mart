import React from 'react'

// styles
import "./CourseCard.css"

// icons
import { BsDownload } from "react-icons/bs"
import { AiFillLike } from "react-icons/ai"
import { AiFillDislike } from "react-icons/ai"



function CourseCard({ course }) {

    const iconTray = {
        fontSize: "1.5rem",
        display: "flex",
        justifyContent: "space-evenly"

    }


    return (

        <div className="col col-lg-4 col-md-6 col-sm-12 card-holder-div">
            <div className="card" style={{ width: "15rem", overflow: "hidden" }}>
                <img src={course.imgUrl} className="card-img" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{course.name.slice(0, 30)}...</h5>
                    <p className="card-text">Instructor (s) : {
                        course.creatorList.map((creator, index) => {
                            return (<span key={index}>{creator}. </span>)
                        })
                    }</p>
                    <p className="card-text">
                        Language : {course.language}
                    </p>
                </div>
            </div>
        </div>

    )
}

export default CourseCard