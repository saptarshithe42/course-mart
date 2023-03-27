import React, { useState } from "react"
import { useParams } from "react-router-dom"

// components
import VideoAccordion from "../../components/VideoAccordion"

// icons
import { AiOutlineCloseSquare } from "react-icons/ai"
import { BsFillArrowUpSquareFill } from "react-icons/bs"
import {BsFillArrowDownSquareFill} from "react-icons/bs"

function ContentUpload() {

    const { id } = useParams()
    const [chapterNumber, setChapterNumber] = useState(1)
    const [chapterName, setChapterName] = useState("")
    const [chapterArr, setChapterArr] = useState([])
    const [videoFile, setVideoFile] = useState(null)
    const [videoFileError, setVideoFileError] = useState(null)
    const [chapterStart, setChapterStart] = useState(false)
    const [videoArr, setVideoArr] = useState([])

    const addChapter = () => {

        setChapterStart(true)
    }

    const handleFileChange = (e) => {

        e.preventDefault()

        // to reset any selected video
        setVideoFile(null)

        let selected = e.target.files[0]  // selecting first element of array of files
        console.log(selected)

        if (!selected) {
            setVideoFileError("Please select a file")
            return
        }

        if (!selected.type.includes("video")) {
            alert("selected file is not video")
            setVideoFileError("selected file must be a video")
            return
        }

        // in case of no error
        setVideoFileError(null)

        setVideoFile(selected)
        // setFileSize(selected.size)
        console.log("file uploaded")

    }

    const addVideo = (e) => {

        e.preventDefault()
        setVideoArr((prev) => {
            return [...prev, videoFile]
        })


        console.log(videoArr);
    }

    const removeVideo = (index) => {

        setVideoArr((prev) => {
            const updatedArr = [...prev];
            updatedArr.splice(index, 1); // remove the element at the specified index
            return updatedArr;
        });
    }

    const moveUp = (index) => {
        setVideoArr((prev) => {
            const updatedArr = [...prev];
            [updatedArr[index], updatedArr[index-1]] = [updatedArr[index-1], updatedArr[index]]
            return updatedArr;
        });
    }

    const moveDown = (index) => {
        setVideoArr((prev) => {
            const updatedArr = [...prev];
            [updatedArr[index], updatedArr[index+1]] = [updatedArr[index+1], updatedArr[index]]
            return updatedArr;
        });
    }


    return (
        <div>
            <form className="course-form">
                <div>
                    <div>
                        {!chapterStart && <button
                            className="btn btn-primary"
                            onClick={addChapter}
                        >
                            Add Chapter
                        </button>}
                        {chapterStart &&

                            <div>

                                <div className="mb-3">
                                    <label htmlFor="chapterName" className="form-label">Chapter Name :</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="chapterName"
                                        aria-describedby="chapterName"
                                        autoComplete="off"
                                        onChange={(e) => setChapterName(e.target.value)}
                                        value={chapterName}
                                        required
                                    />
                                </div>
                                {
                                    <div>
                                        <h5>{chapterName}</h5>
                                        <ol>
                                            {videoArr.map((video, index) => {
                                                return (
                                                    <div>
                                                        <li key={index}>
                                                            {video.name} &nbsp;
                                                            <AiOutlineCloseSquare
                                                                className="close-button"
                                                                onClick={() => { removeVideo(index) }}
                                                                fontSize="1.5rem" />

                                                            {index != 0 &&
                                                                <BsFillArrowUpSquareFill
                                                                className="close-button"
                                                                onClick={() => { moveUp(index)}}
                                                                fontSize="1.5rem" 
                                                                />
                                                                }

                                                                {index != (videoArr.length-1) &&
                                                                <BsFillArrowDownSquareFill
                                                                className="close-button"
                                                                onClick={() => { moveDown(index)}}
                                                                fontSize="1.5rem" 
                                                                />
                                                                }
                                                        </li>

                                                    </div>
                                                )
                                            })}
                                        </ol>
                                    </div>
                                }

                                <div className="mb-3">
                                    <label htmlFor="videoFile" className="form-label">Upload Video : </label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="videoFile"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>

                                {!videoFileError && videoFile &&
                                    <div>
                                        <button className="btn btn-primary"
                                            onClick={addVideo}
                                        >Add Video</button>
                                        <button className="btn btn-primary">End Chapter</button>
                                    </div>
                                }

                            </div>

                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ContentUpload