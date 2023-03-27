import React, { useEffect, useState } from "react"

// styles
import "./ChapterAccordion.css"

// components
import Accordion from "react-bootstrap/Accordion";

function ChapterAccordion(prop) {

    const { chapterArr, deleteChapter, chapterMoveUp, chapterMoveDown } = prop

    return (
        <Accordion alwaysOpen>
            {chapterArr &&
                chapterArr.map((chapter, index) => {

                    return (
                        <Accordion.Item eventKey={index} key={index}>
                            <Accordion.Header>
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="header-div-element"> {chapter.name} </div>
                                            <div className="header-div-element">({chapter.videoArr.length} Lectures) </div>
                                        </div>
                                        {(index !== 0) &&
                                            <div className="col text-center">
                                                <a className="btn btn-success"
                                                    onClick={(e) => { chapterMoveUp(index, e) }}
                                                >Up</a>
                                            </div>
                                        }

                                        {(index !== (chapterArr.length - 1)) &&
                                            <div className="col text-center">
                                                <a className="btn btn-primary"
                                                    onClick={(e) => { chapterMoveDown(index, e) }}
                                                >Down</a>
                                            </div>
                                        }

                                        <div className="col text-center">
                                            <a className="btn btn-danger"
                                                onClick={(e) => { deleteChapter(index, e) }}
                                            >Delete</a>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ol>
                                    {chapter.videoArr.map((video, index) => {
                                        return (
                                            <li key={index}>{video.topic}</li>
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

export default ChapterAccordion