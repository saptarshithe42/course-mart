import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./CourseView.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import ReactPlayer from "react-player"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseViewAccordion from "../../components/CourseViewAccordion"
import ReviewModalForm from "../../components/ReviewModalForm"

function CourseView() {

	const { id } = useParams()
	const { user } = useAuthContext()
	const navigate = useNavigate()

	const [course, setCourse] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [contentList, setContentList] = useState(null)
	const [currentVideoURL, setCurrentVideoURL] = useState("")
	const [currentVideoName, setCurrentVideoName] = useState("")
	const [currentChapterName, setCurrentChapterName] = useState("")
	const [reviewModalShow, setReviewModalShow] = useState(false)

	useEffect(() => {

		const fetchData = async () => {

			try {

				// check if user has purchased this course

				const userRef = projectFirestore.collection("users").doc(user.uid)

				const purchasedCourses = (await userRef.get()).data().purchasedCourses

				if (!purchasedCourses.includes(id)) {

					navigate("/")
				}

				// fetching course content data
				const contentRef = projectFirestore.collection("course_contents").doc(id)
				let courseContent = (await contentRef.get()).data()
				setContentList(courseContent.content)
				setCurrentVideoURL(courseContent.content[0].videoArr[0].fileUrl)
				setCurrentVideoName(courseContent.content[0].videoArr[0].topic)
				setCurrentChapterName(courseContent.content[0].name)

				const courseRef = projectFirestore.collection("courses").doc(id)

				// fetching course Data
				let course = (await courseRef.get()).data()
				setCourse(course)
				setIsLoading(false)
			} catch (err) {

				setIsLoading(false)
				toast.error(err.message, {
					position: "top-center"
				})

			}
		}

		// fetching
		fetchData();

	}, [])

	return (
		<div className="container course-view-div">
			{isLoading ? <LoadingAnimation /> :
				<div className="row">
					<ToastContainer />
					<ReviewModalForm
						show={reviewModalShow}
						id={id}
						course={course}
						onHide={() => { setReviewModalShow(false) }}
					/>
					<div className="col-12 col-lg-6">
						{/* <div className="col-12"> */}
						<div className="course-video-div">
							{/* {contentList && */}
							<h1>{currentChapterName}</h1>
							<h2>{currentVideoName}</h2>
							<div className="player-wrapper">
								<ReactPlayer
									// url={contentList[0].videoArr[0].fileUrl}
									className="react-player"
									url={currentVideoURL}
									controls={true}
									width="100%"
									height="100%"
									config={{
										file: {
											attributes: {
												onContextMenu: e => e.preventDefault(),
												controlsList: "nodownload"
											}
										}
									}}
								/>

								<button
									className="btn btn-light"
									onClick={() => setReviewModalShow(true)}
									style={{margin : "1rem"}}
								>
									<strong> Rate Course </strong>
								</button>

								{/* <video height="20rem" width="25rem" controls>
									<source src={currentVideoURL} type="video/mp4" />
								</video> */}
							</div>
							{/* } */}
						</div>
					</div>
					<div className="col-12 col-lg-6">
						{/* <div className="col-12"> */}
						<div className="course-content-div">
							<h2 style={{ textAlign: "center" }}>Course Contents</h2>
							<CourseViewAccordion
								chapterArr={contentList}
								setCurrentVideoURL={setCurrentVideoURL}
								setCurrentVideoName={setCurrentVideoName}
								setCurrentChapterName={setCurrentChapterName}
							/>
						</div>
					</div>

				</div>
			}

		</div>
	)
}

export default CourseView