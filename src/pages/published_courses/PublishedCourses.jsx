import React, { useState, useEffect } from "react"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./PublishedCourses.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import CourseGrid from "../../components/CourseGrid"

function PublishedCourses() {

	const [isLoading, setIsLoading] = useState(false)
	const [drafts, setDrafts] = useState([])
	const [fetchLimit, setFetchLimit] = useState(3)

	const { user } = useAuthContext()


	useEffect(() => {

		const fetchData = async () => {

			try {

				setIsLoading(true)

				const userRef = projectFirestore.collection("users").doc(user.uid)

				// fetching the data

				let draftIDArr = (await userRef.get()).data().drafts

				let len = draftIDArr.length

				// fetching limited amount first
				let i = 0;
				let currentFetch = []

				while(i < fetchLimit){
					if(i == len)
						break;

					currentFetch.push(draftIDArr[i])
					i++;
				}


				// fetch course content entry for every ID

				const contentRef = projectFirestore.collection("course_contents")

				let arr = []

				for (const courseID of currentFetch) {
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

	}, [fetchLimit])

	const incrementFetchLimit = () => {

		setFetchLimit((prev) => {
			return (prev + 5);
		})

	}


	return (
		<div>
			{isLoading ? <LoadingAnimation /> :

				<div className="main-div">
					<h1 className="list-heading">Drafts</h1>
					<CourseGrid
						courseList={drafts}
						cardType="draft"
					/>

					<button className="btn btn-primary"
						onClick={incrementFetchLimit}
					>More</button>
				</div>

			}
		</div>
	)
}

export default PublishedCourses