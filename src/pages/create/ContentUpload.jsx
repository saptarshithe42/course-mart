import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuthContext } from "../../hooks/useAuthContext"
import { projectStorage } from "../../firebase/config"

// styles
import "./ContentUpload.css"

// components
import ChapterAccordion from "../../components/ChapterAccordion"
import  LoadingAnimation from "../../components/LoadingAnimation"

// icons
import { AiOutlineCloseSquare } from "react-icons/ai"
import { BsArrowUpSquare } from "react-icons/bs"
import { BsArrowDownSquare } from "react-icons/bs"

function ContentUpload() {

    const { courseName, id } = useParams()
    const [chapterNumber, setChapterNumber] = useState(1)
    const [chapterName, setChapterName] = useState("")
    const [chapterArr, setChapterArr] = useState([])
    const [videoFile, setVideoFile] = useState(null)
    const [videoFileError, setVideoFileError] = useState(null)
    const [videoTopicName, setVideoTopicName] = useState("")
    const [chapterStart, setChapterStart] = useState(false)
    const [videoArr, setVideoArr] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const { user } = useAuthContext()
    const navigate = useNavigate()

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

        setVideoTopicName("")

        const videoObj = {
            topic: videoTopicName,
            file: videoFile
        }

        setVideoArr((prev) => {
            return [...prev, videoObj]
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
            [updatedArr[index], updatedArr[index - 1]] = [updatedArr[index - 1], updatedArr[index]]
            return updatedArr;
        });
    }

    const moveDown = (index) => {
        setVideoArr((prev) => {
            const updatedArr = [...prev];
            [updatedArr[index], updatedArr[index + 1]] = [updatedArr[index + 1], updatedArr[index]]
            return updatedArr;
        });
    }

    const endChapter = () => {
        setChapterStart(false)

        setChapterArr((prev) => {

            const chapterObj = {
                name: chapterName,
                videoArr: videoArr
            }

            let currentArr = [...prev, chapterObj]

            return currentArr;
        })

        setVideoArr([])
        setVideoFile(null)
        setVideoFileError(null)
        setVideoTopicName("")
        setChapterName("")
    }

    const cancelChapter = () => {

        setChapterStart(false)
        setVideoArr([])
        setVideoFile(null)
        setVideoFileError(null)
        setVideoTopicName("")
        setChapterName("")

    }

    const chapterMoveUp = (index, e) => {
        e.preventDefault()

        setChapterArr((prev) => {
            const updatedArr = [...prev];
            [updatedArr[index], updatedArr[index - 1]] = [updatedArr[index - 1], updatedArr[index]]
            return updatedArr;
        });
    }

    const chapterMoveDown = (index, e) => {
        e.preventDefault()

        setChapterArr((prev) => {
            const updatedArr = [...prev];
            [updatedArr[index], updatedArr[index + 1]] = [updatedArr[index + 1], updatedArr[index]]
            return updatedArr;
        });
    }

    const deleteChapter = (index, e) => {

        e.preventDefault()

        setChapterArr((prev) => {
            const updatedArr = [...prev];
            updatedArr.splice(index, 1); // remove the element at the specified index
            return updatedArr;
        });

    }

    const publishCourse = async () => {

        let contentArr = []

        try {

            setIsLoading(true)

            for (const chapter of chapterArr) {

                let chapterObj = {
                    name: chapter.name,
                    videoArr: []
                }

                for (const video of chapter.videoArr) {

                    const file = video.file

                    const fileUploadPath = `videos/${user.uid}/${chapter.name}/${video.topic}`

                    const uploadedFile = await projectStorage.ref(fileUploadPath).put(file)

                    const fileUrl = await uploadedFile.ref.getDownloadURL()  // getting the url of the file

                    const videoObj = {
                        topic: video.topic,
                        fileUrl: fileUrl
                    }

                    chapterObj.videoArr.push(videoObj)

                }
                contentArr.push(chapterObj)
            }

            setIsLoading(false)
            console.log(contentArr);
            navigate("/")

        } catch (err) {
            alert(err)
        }

    }


    return (
        <div>
            {isLoading ? <LoadingAnimation /> :
                
                <div className="content-upload-div">
                <h1 style={{ textAlign: "center" }}>{courseName}</h1>
                <form className="course-form content-form">
                    <div>
                        <div>
                            {chapterArr &&
                                <div>
                                    <ChapterAccordion
                                        chapterArr={chapterArr}
                                        deleteChapter={deleteChapter}
                                        chapterMoveUp={chapterMoveUp}
                                        chapterMoveDown={chapterMoveDown}
                                    />
                                </div>
                            }
                            {!chapterStart &&
                                <div style={{ textAlign: "center" }}>

                                    <button
                                        className="btn btn-primary"
                                        onClick={addChapter}
                                    >
                                        Add Chapter
                                    </button>
                                </div>
                            }
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
                                                        <div key={index}>
                                                            <li key={index}>
                                                                {video.topic} &nbsp;
                                                                <div className="icon-div">
                                                                    <AiOutlineCloseSquare
                                                                        className="close-button icon"
                                                                        onClick={() => { removeVideo(index) }}
                                                                        fontSize="1.5rem" />

                                                                    {index != 0 &&
                                                                        <BsArrowUpSquare
                                                                            className="up-button icon"
                                                                            onClick={() => { moveUp(index) }}
                                                                            fontSize="1.5rem"
                                                                        />
                                                                    }

                                                                    {index != (videoArr.length - 1) &&
                                                                        <BsArrowDownSquare
                                                                            className="down-button icon"
                                                                            onClick={() => { moveDown(index) }}
                                                                            fontSize="1.5rem"
                                                                        />
                                                                    }
                                                                </div>
                                                            </li>

                                                        </div>
                                                    )
                                                })}
                                            </ol>
                                        </div>
                                    }

                                    <div className="mb-3">
                                        <label htmlFor="videoTopicName" className="form-label">Topic of video :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="videoTopicName"
                                            aria-describedby="videoTopicName"
                                            autoComplete="off"
                                            onChange={(e) => setVideoTopicName(e.target.value)}
                                            value={videoTopicName}
                                            required
                                        />
                                    </div>

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
                                        <div style={{ textAlign: "center" }}>
                                            <button className="btn btn-primary"
                                                onClick={addVideo}
                                            >Add Video</button>

                                            {(videoArr.length !== 0) &&
                                                <button className="btn btn-primary"
                                                    onClick={endChapter}
                                                >End Chapter</button>
                                            }
                                        </div>
                                    }

                                    <div style={{ textAlign: "center" }}>

                                        <button
                                            className="btn btn-primary"
                                            onClick={cancelChapter}
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                </div>

                            }
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>

                        {!chapterStart && (chapterArr.length !== 0) && <button
                            className="btn btn-primary"
                            onClick={(e) => { e.preventDefault(); publishCourse() }}
                        >
                            Publish
                        </button>}
                    </div>
                </form>
            </div>}
        </div>
    )
}

export default ContentUpload