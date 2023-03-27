import React, { useState, useEffect } from "react"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./Draft.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import CourseGrid from "../../components/CourseGrid"

function Draft() {

	const [draftIDs, setDraftIDs] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [drafts, setDrafts] = useState([])

	const { user } = useAuthContext()


	useEffect(() => {

		const fetchData = async () => {

			try {

				setIsLoading(true)

				const userRef = projectFirestore.collection("users").doc(user.uid)

				// fetching the data

				let draftIDArr = (await userRef.get()).data().drafts

				setDraftIDs(draftIDArr)

				// setIsLoading(false)
				console.log(draftIDArr)


				// fetch course content entry for every ID

				const contentRef = projectFirestore.collection("course_contents")

				let arr = []

				for (const courseID of draftIDArr) {
					let doc = (await contentRef.doc(courseID).get())

					arr.push({ ...doc.data(), id: doc.id })
				}

				setDrafts(arr)

				setIsLoading(false)

				console.log(arr)


			} catch (err) {
				alert(err.message)
			}
		}

		fetchData()

	}, [])


	return (
		<div>
			{isLoading ? <LoadingAnimation /> :

				<div className="main-div">
					<h1 className="list-heading">Drafts</h1>
					<CourseGrid
						courseList={drafts}
						cardType="draft"
					/>

					{/* <button className="btn btn-primary"
						onClick={incrementFetchLimit}
					>More</button> */}
				</div>

			}
		</div>
	)
}

export default Draft