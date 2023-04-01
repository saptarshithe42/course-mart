import React, { useState, useEffect } from "react"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./PurchasedCourses.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import CourseGrid from "../../components/CourseGrid"
import { toast } from "react-toastify"

function PurchasedCourses() {

	const [isLoading, setIsLoading] = useState(false)
	const [purchasedCourses, setPurchasedCourses] = useState([])

	const { user } = useAuthContext()


	useEffect(() => {

		const fetchData = async () => {

			try {

				setIsLoading(true)

				const userRef = projectFirestore.collection("users").doc(user.uid)

				// fetching the data

				let purchasedIDArr = (await userRef.get()).data().purchasedCourses

				// fetch course entry for every ID

				const courseRef = projectFirestore.collection("courses")

				let arr = []

				for (const courseID of purchasedIDArr) {
					let doc = (await courseRef.doc(courseID).get())

					arr.push({ ...doc.data(), id: doc.id })
				}

				setPurchasedCourses(arr)

				setIsLoading(false)

				console.log(arr)


			} catch (err) {
				toast.error(err.message, {
                    position : "top-center"
                })
			}
		}

		fetchData()

	}, [])


	return (
		<div>
			{isLoading ? <LoadingAnimation /> :

				<div className="main-div">
					<h1 className="list-heading">Purchased Courses</h1>
					<CourseGrid
						courseList={purchasedCourses}
						cardType="purchased"
					/>

				</div>

			}
		</div>
	)
}

export default PurchasedCourses