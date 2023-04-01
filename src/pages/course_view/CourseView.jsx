import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./CourseView.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import ReactPlayer from "react-player"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function CourseView() {

	const { id } = useParams()

	const [course, setCourse] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [contentList, setContentList] = useState(null)

	useEffect(() => {

		const fetchData = async () => {

			try {

				// fetching course content data
				const contentRef = projectFirestore.collection("course_contents").doc(id)
				let courseContent = (await contentRef.get()).data()
				

				const courseRef = projectFirestore.collection("courses").doc(id)

				// fetching course Data
				let course = (await courseRef.get()).data()

				setCourse(course)
				setContentList(courseContent.content)
				setIsLoading(false)
			} catch (err) {

				setIsLoading(false)
				toast.error(err.message, {
					position: "top-center"
				})

			}
		}

		// fetching book
		fetchData();

	}, [])

	return (
		<div className="container course-view-div">
			{isLoading ? <LoadingAnimation /> :
				<div className="row">
				<div className="col-12 col-lg-6">
					{contentList &&
						<div>
						<p>{contentList[0].name}</p>
						<ReactPlayer 
						url={contentList[0].videoArr[0].fileUrl} 
						controls={true}

						/>
					</div>}
				</div>
				<div className="col-12 col-lg-6">
					Chapter Accordion
				</div>

			</div>
			}

		</div>
	)
}

export default CourseView