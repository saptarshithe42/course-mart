import { useCollection } from "../../hooks/useCollection"
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext"
import { projectFirestore } from "../../firebase/config";

// styles
import './Dashboard.css'

// components
import SearchComponent from "../../components/SearchComponent";
import BooksGrid from "../../components/BooksGrid";
import LoadingAnimation from "../../components/LoadingAnimation";


export default function Dashboard() {

	// const {documents : bookList, error} = useCollection("books", {})

	const [isLoading, setIsLoading] = useState(false)
	const [bookList, setBookList] = useState([])
	const booksRef = projectFirestore.collection("books")
	const [fetchLimit, setFetchLimit] = useState(3)

	useEffect(() => {

		const fetchBooks = async () => {
			// fetch 5 most popular books

			try {
				// setIsLoading(true)
				// let docs = await booksRef.orderBy("upvotes", "desc").limit(fetchLimit).get()

				// let arr = []
				// docs.forEach((doc) => {
				// 	// doc.data()
				// 	arr.push({ ...doc.data(), id: doc.id })
				// 	// console.log(doc.data())

				// })

				// setBookList(arr)

				// setIsLoading(false);
			} catch (err) {
				alert(err)
			}

		}

		fetchBooks()
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
					<BooksGrid
						bookList={bookList}
					/>

					<button className="btn btn-primary"
						onClick={incrementFetchLimit}
					>More</button>
				</div>
			}

		</div>
	)
}
