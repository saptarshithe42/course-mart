import { useCollection } from "../../hooks/useCollection"
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext"
import { projectFirestore } from "../../firebase/config";

// styles
import './Dashboard.css'

// components
import SearchComponent from "../../components/SearchComponent";
import CourseGrid from "../../components/CourseGrid";
import LoadingAnimation from "../../components/LoadingAnimation";


export default function Dashboard() {

	const [isLoading, setIsLoading] = useState(false)
	const [courseList, setCourseList] = useState([])
	const [fetchLimit, setFetchLimit] = useState(3)

	useEffect(() => {

		const fetchData = async () => {

			try {
				setIsLoading(true)

				const courseRef = projectFirestore.collection("courses")
				let docs = await courseRef
				.where("isPublished", "==", true)
				.orderBy("enrolledCount", "desc")
				.orderBy("avgRating", "desc")
				.limit(fetchLimit).get()

				let arr = []
				docs.forEach((doc) => {
					arr.push({ ...doc.data(), id: doc.id })

				})

				setCourseList(arr)

				setIsLoading(false);
			} catch (err) {
				console.log(err);
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
		<div className="dashboard">

			<SearchComponent />
			{isLoading ? <LoadingAnimation /> :
				<div className="main-div">
					<h1 className="list-heading">Most Popular</h1>
					<CourseGrid
						courseList={courseList}
						cardType="course"
					/>

					<button className="btn btn-primary"
						onClick={incrementFetchLimit}
					>More</button>
				</div>
			}

		</div>
	)
}
