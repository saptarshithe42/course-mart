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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
				.orderBy("avgRating", "desc")
				.orderBy("enrolledCount", "desc")
				.limit(fetchLimit).get()

				let arr = []
				docs.forEach((doc) => {
					arr.push({ ...doc.data(), id: doc.id })

				})

				setCourseList(arr)

				setIsLoading(false);
			} catch (err) {

				// alert(err)
				
				toast.error(err.message, {
					position : "top-center"
				})

				console.log(err.message)
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
			<ToastContainer />
			{isLoading ? <LoadingAnimation /> :
				<div className="main-div">
					<h1 className="list-heading">Highly Rated Courses</h1>
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
