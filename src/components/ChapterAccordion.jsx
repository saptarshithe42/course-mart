import React, { useEffect, useState } from "react"

// styles
import "./ChapterAccordion.css"

// components
import Accordion from "react-bootstrap/Accordion";

// icons
import { AiOutlineCloseSquare } from "react-icons/ai"
import { BsArrowUpSquare } from "react-icons/bs"
import { BsArrowDownSquare } from "react-icons/bs"

function ChapterAccordion(prop) {

    const { chapterArr, deleteChapter, chapterMoveUp, chapterMoveDown } = prop

    return (
        <Accordion alwaysOpen>
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
                                        {(index !== 0) &&
                                            <div className="col text-center">
                                                <BsArrowUpSquare
                                                    className="up-button icon"
                                                    onClick={(e) => { chapterMoveUp(index, e) }}
                                                    
                                                />
                                            </div>
                                        }

                                        {(index !== (chapterArr.length - 1)) &&
                                            <div className="col text-center">
                                                <BsArrowDownSquare
                                                    className="down-button icon"
                                                    onClick={(e) => { chapterMoveDown(index, e) }}
                                                    
                                                />
                                            </div>
                                        }

                                        <div className="col text-center">
                                            <AiOutlineCloseSquare
                                                className="close-button icon"
                                                onClick={(e) => { deleteChapter(index, e) }}
                                                 />
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