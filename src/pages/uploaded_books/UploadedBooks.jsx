import { useCollection } from "../../hooks/useCollection"
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext"
import { projectFirestore } from "../../firebase/config";

// styles
// import './Favourites.css'

// components
import BooksGrid from "../../components/BooksGrid";
import LoadingAnimation from "../../components/LoadingAnimation";


export default function UploadedBooks() {

	// const {documents : bookList, error} = useCollection("books", {})

	const [isLoading, setIsLoading] = useState(false)
	const [bookList, setBookList] = useState([])
	
	
	const [fetchLimit, setFetchLimit] = useState(3)

	const {user} = useAuthContext()

	

	useEffect(() => {

		const fetchBooks = async () => {

			try {
				setIsLoading(true)
				// let docs = await booksRef.orderBy("upvotes", "desc").limit(fetchLimit).get()
				const booksRef = projectFirestore.collection("books")
				const userRef = projectFirestore.collection("users").doc(user.uid)
				let uploadedArr = (await userRef.get()).data().uploadedBooks

				let len = uploadedArr.length

				// fetching limited amount first
				let i = 0;
				let currentFetch = []

				while(i < fetchLimit){
					if(i == len)
						break;

					currentFetch.push(uploadedArr[i])
					i++;
				}
				
				let arr = []

				for(const bookID of currentFetch){
						let doc = (await booksRef.doc(bookID).get())

						arr.push({...doc.data(), id : doc.id})
				}

				setBookList(arr)

				setIsLoading(false);
				// console.log(bookList);
				// console.log(arr);
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
			{isLoading ? <LoadingAnimation /> :
				<div className="main-div">
					<h1 className="list-heading">Uploaded Books</h1>
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
