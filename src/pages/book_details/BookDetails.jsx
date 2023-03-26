import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LoadingAnimation from "../../components/LoadingAnimation"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// styles
import "./BookDetails.css"

// icons
import { BsDownload } from "react-icons/bs"
import { AiFillLike, AiFillStar } from "react-icons/ai"
import { AiFillDislike } from "react-icons/ai"
import { RiDownloadLine } from "react-icons/ri"



function BookDetails() {

    const { id } = useParams()
    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [upvotes, setUpvotes] = useState(0)
    const [downvotes, setDownvotes] = useState(0)
    const [downloads, setDownloads] = useState(0)
    const [isDisabled, setisDisabled] = useState(false)
    const [markedAsFavourite, setMarkedAsFavourite] = useState(false)

    const { user } = useAuthContext()


    useEffect(() => {

        const fetchBook = async () => {

            try {
                const docRef = projectFirestore.collection("books").doc(id)

                // fetching book
                let data = (await docRef.get()).data()

                setBook(data)
                setUpvotes(data.upvotes)
                setDownvotes(data.downvotes)
                setDownloads(data.downloads)
                setIsLoading(false)
            } catch (err) {

                setIsLoading(false)
                alert(err)

            }
        }

        // fetching book
        fetchBook();

    }, [])

    const incrementLikes = async () => {

        await projectFirestore.collection("books").doc(id).update({ upvotes: (upvotes + 1) })

        setUpvotes((prev) => {
            return (prev + 1);
        })

        setisDisabled(true)
    }

    const incrementDisLikes = async () => {

        await projectFirestore.collection("books").doc(id).update({ downvotes: (downvotes + 1) })

        setDownvotes((prev) => {
            return (prev + 1);
        })

        setisDisabled(true)
    }

    const incrementDownloads = async () => {

        try {

            await projectFirestore.collection("books").doc(id).update({ downloads: (downloads + 1) })

            setDownloads((prev) => {
                return (prev + 1);
            })

            // updating users downloadedBooks list
            if (user) // user is logged in
            {
                const userRef = projectFirestore.collection("users").doc(user.uid);
                let downloadedArr = (await userRef.get()).data().downloadedBooks

                // adding currently downloaded book ID in downloadedBooks array in user's document
                if (!downloadedArr.includes(id)) // new download
                {
                    downloadedArr.push(id)
                    await userRef.update({
                        downloadedBooks: downloadedArr
                    })
                }


            }
        } catch (err) {
            alert(err)
        }
    }

    const addToFavourites = async () => {

        try {
            setMarkedAsFavourite(true)
            const userRef = projectFirestore.collection("users").doc(user.uid);
            let favArr = (await userRef.get()).data().favourites

            // adding currently favourite marked book ID in downloadedBooks array in user's document
            if (!favArr.includes(id)) // new download
            {
                favArr.push(id)
                await userRef.update({
                    favourites: favArr
                })
            }
        } catch (err) {
            alert(err)
        }
    }

    return (
        <div className="container book-details-container">
            {isLoading ? <LoadingAnimation /> :
                <div className="row book-details-holder" style={{ color: "white" }}>
                    <div className="col-12 col-lg-6 book-img-div">
                        <img src={book.imgUrl} className="book-img" />
                    </div>

                    <div className="col-12 col-lg-6 book-details">
                        <div style={{textAlign : "center"}}>
                            <h1>{book.name}</h1>
                            <p>{book.authorList.map((author, index) => {
                                return <span key={index}>{author}. </span>
                            })}</p>
                            <p>
                                <span>Language : {book.language} </span> &nbsp;
                                <span>Size : {book.size.toFixed(2)} MB </span>
                            </p>
                            <p>Uploaded by : {book.uploadedBy}</p>
                            <p>Uploaded {formatDistanceToNow(book.uploadedAt.toDate(), {addSuffix: true})}</p>
                        </div>

                        <div className="row">
                            <div className="icon-div col-12 col-md-3">{downloads} &nbsp; <BsDownload /> </div>
                            <div className="icon-div col-12 col-md-3">

                                <button
                                    className="icon-btn btn btn-outline-success"
                                    disabled={isDisabled}
                                    onClick={incrementLikes}
                                >
                                    {upvotes} &nbsp;
                                    Like &nbsp;
                                    <AiFillLike />
                                </button>
                            </div>
                            <div className="icon-div col-12 col-md-3">
                                <button
                                    className="btn btn-outline-danger"
                                    disabled={isDisabled}
                                    onClick={incrementDisLikes}
                                >
                                    {downvotes} &nbsp;
                                    Dislike &nbsp;
                                    <AiFillDislike />
                                </button>
                            </div>
                        </div>

                        <p className="book-description">{book.description}</p>

                        <div style={{ textAlign: "center" }}>


                            {user && <button
                                className="btn btn-warning"
                                style={{ color: "black" }}
                                onClick={addToFavourites}
                                disabled={markedAsFavourite}
                            >
                                Favourite <AiFillStar />
                            </button>}

                            <a
                                className="btn btn-success download-btn"
                                href={book.fileUrl}
                                target="_blank"
                                style={{ color: "white" }}
                                onClick={incrementDownloads}
                            // download={book.fileUrl}
                            >
                                Download <RiDownloadLine />
                            </a>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default BookDetails