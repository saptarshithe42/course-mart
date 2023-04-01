import React, { useEffect, useState } from "react"

// styles
import "./CourseViewAccordion.css"

// components
import Accordion from "react-bootstrap/Accordion";


// icons
import {AiFillPlayCircle} from "react-icons/ai"

function CourseViewAccordion(prop) {

    const { chapterArr, setCurrentVideoURL, setCurrentVideoName,
        setCurrentChapterName } = prop

    return (
        <Accordion alwaysOpen className="course-view-accordion">
            {chapterArr &&
                chapterArr.map((chapter, index) => {

                    return (
                        <Accordion.Item eventKey={index} key={index}>
                            <Accordion.Header>
                                <div className="container acc-header">
                                    <div className="row">
                                        <div className="col">
                                            <div className="header-div-element"> {chapter.name} </div>
                                            <div className="header-div-element">({chapter.videoArr.length} Lectures) </div>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ol style={{lineHeight : "3"}}>
                                    {chapter.videoArr.map((video, index) => {
                                        return (
                                            <li 
                                            onClick={() => {
                                                setCurrentVideoURL(video.fileUrl);
                                                setCurrentVideoName(video.topic);
                                                setCurrentChapterName(chapter.name)
                                                }}
                                            style={{cursor : "pointer", fontSize : "1rem"}}
                                            key={index}
                                            >
                                            {video.topic} &nbsp; 
                                            <AiFillPlayCircle fontSize="1.5rem" style={{color : "blue"}} />
                                            </li>
                                        )
                                    })}
                                </ol>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })
            }
        </Accordion>
    )
}

export default CourseViewAccordion