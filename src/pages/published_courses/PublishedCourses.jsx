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
	const [publishedCourses, setPublishedCourses] = useState([])
	const [fetchLimit, setFetchLimit] = useState(3)

	const { user } = useAuthContext()


	useEffect(() => {

		const fetchData = async () => {

			try {

				setIsLoading(true)

				const userRef = projectFirestore.collection("users").doc(user.uid)

				// fetching the data

				let publishedIDArr = (await userRef.get()).data().publishedCourses

				let len = publishedIDArr.length

				// fetching limited amount first
				let i = 0;
				let currentFetch = []

				while(i < fetchLimit){
					if(i == len)
						break;

					currentFetch.push(publishedIDArr[i])
					i++;
				}


				// fetch course entry for every ID

				const courseRef = projectFirestore.collection("courses")

				let arr = []

				for (const courseID of currentFetch) {
					let doc = (await courseRef.doc(courseID).get())

					arr.push({ ...doc.data(), id: doc.id })
				}

				setPublishedCourses(arr)

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
					<h1 className="list-heading">Published Courses</h1>
					<CourseGrid
						courseList={publishedCourses}
						cardType="published"
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