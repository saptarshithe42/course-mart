import React, { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./CourseDetails.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import ChapterAccordion from "../../components/ChapterAccordion"
import ReactPlayer from "react-player"
import { Rating } from "react-simple-star-rating"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReviewModalForm from "../../components/ReviewModalForm"

// icons
import { BsFillSuitHeartFill } from "react-icons/bs"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { BsCurrencyRupee } from "react-icons/bs"
import ReviewContainer from "../../components/ReviewContainer"


function CourseDetails() {

    const { id } = useParams()
    const [course, setCourse] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [contentList, setContentList] = useState(null)
    const [addedToCart, setAddedToCart] = useState(false)
    const [disableAddToCart, setDisableAddToCart] = useState(false)
    const [addedToWishlist, setAddedToWishlist] = useState(false)
    const [disableAddToWishlist, setDisableAddToWishlist] = useState(false)
    const [isPurchased, setIsPurchased] = useState(false)
    const [reviewModalShow, setReviewModalShow] = useState(false)
    const [reviews, setReviews] = useState([])
    const [reviewFetchLimit, setReviewFetchLimit] = useState(2)
    const [reviewLoading, setReviewLoading] = useState(true)

    const playerRef = useRef(null);

    const { user } = useAuthContext()


    useEffect(() => {

        const fetchData = async () => {

            try {
                const docRef = projectFirestore.collection("courses").doc(id)

                // fetching course Data
                let course = (await docRef.get()).data()

                setCourse(course)
                // fetching course content data
                const contentRef = projectFirestore.collection("course_contents").doc(id)
                let courseContent = (await contentRef.get()).data()


                if (user.uid === course.createdByID) {
                    setDisableAddToCart(true)
                    setDisableAddToWishlist(true)
                }
                else {
                    const userRef = projectFirestore.collection("users").doc(user.uid)
                    let userData = (await userRef.get()).data()

                    let cart = userData.cart
                    let wishlist = userData.wishlist
                    let purchasedCourses = userData.purchasedCourses

                    if (purchasedCourses.includes(id)) {

                        setIsPurchased(true)
                    }

                    else if (cart.includes(id)) {
                        setDisableAddToCart(true)
                        setDisableAddToWishlist(true)
                    }
                    else if (wishlist.includes(id)) {
                        setDisableAddToWishlist(true)
                    }
                }

                setContentList(courseContent.content)
                setIsLoading(false)
            } catch (err) {

                setIsLoading(false)
                toast.error(err.message, {
                    position: "top-center"
                })

            }
        }

        // fetching data
        fetchData();

    }, [])

    useEffect(() => {

        const fetchReviews = async () => {

            try {
                setReviewLoading(true)
                // fetching reviews
                const reviewRef = projectFirestore.collection("reviews")
                let docs = await reviewRef
                    .where("courseID", "==", id)
                    .orderBy("rating", "desc")
                    .limit(reviewFetchLimit).get()

                let arr = []
                docs.forEach((doc) => {
                    arr.push({ ...doc.data(), id: doc.id })

                })
                setReviews(arr)
                setReviewLoading(false)

            } catch (err) {
                console.log(err.message);
                toast.error(err.message, {
                    position: "top-center",
                    autoClose: 5000
                })
            }
        }

        fetchReviews()

    }, [reviewFetchLimit])

    const incrementReviewFetchLimit = () => {

		setReviewFetchLimit((prev) => {
			return (prev + 3);
		})

	}




    const addToCart = async () => {

        try {

            // adding current course ID to user"s cart array
            const userRef = projectFirestore.collection("users").doc(user.uid)

            let userData = (await userRef.get()).data()

            let cart = userData.cart
            let wishlist = userData.wishlist

            cart.push(id)

            wishlist = wishlist.filter((courseID) => courseID !== id)

            await userRef.update({
                cart: cart,
                wishlist: wishlist
            })

            toast.success("Added To Cart !", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            setAddedToCart(true)
            setDisableAddToCart(true)
        } catch (err) {
            // alert(err)
            toast.error(err.message, {
                position: "top-center"
            })
        }

    }

    const addToWishlist = async () => {

        try {
            // adding current course ID to user"s cart array
            const userRef = projectFirestore.collection("users").doc(user.uid)

            let wishlist = (await userRef.get()).data().wishlist

            wishlist.push(id)

            await userRef.update({
                wishlist: wishlist
            })

            toast.success("Added To Wishlist !", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            setAddedToWishlist(true)
            setDisableAddToWishlist(true)
        } catch (err) {
            toast.error(err.message, {
                position: "top-center"
            })
        }

    }



    return (
        <div className="container course-details-container">
            {isLoading ? <LoadingAnimation /> :
                <div className="row course-details-holder" style={{ color: "white" }}>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover={false}
                        theme="light"
                    />
                    <ReviewModalForm
                        show={reviewModalShow}
                        id={id}
                        course={course}
                        onHide={() => { setReviewModalShow(false) }}
                    />
                    <div className="col-12 col-lg-6 course-details">
                        <div style={{ textAlign: "center" }}>
                            <h1>{course.name}</h1>
                            <div>{course.creatorList.map((creator, index) => {
                                return <span key={index}>{creator}. </span>
                            })}</div>

                            <div className="rating-div" style={{ fontSize: "1rem" }}>
                            <span>({Math.round(course.avgRating * 10) / 10}) </span>
                                <Rating
                                    initialValue={course.avgRating}
                                    allowFraction="true"
                                    readonly="true"
                                    size="1.5rem"
                                /> <span>({course.ratedCount} ratings) </span>
                            </div>
                            <div>{course.enrolledCount} Students</div>
                            <div>
                                <span>Language : {course.language} </span>
                            </div>
                            {/* <p>Last updated : {formatDistanceToNow(course.updatedAt.toDate(), {addSuffix: true})}</p> */}
                            <div>Last updated : {new Date((course.updatedAt.toDate())).getMonth()} / {new Date((course.updatedAt.toDate())).getFullYear()}</div>
                        </div>

                        <div className="col-12" style={{ marginTop: "2rem" }}>
                            <ChapterAccordion chapterArr={contentList} />
                        </div>

                        <div className="course-description">{course.description}</div>

                    </div>

                    <div className="col-12 col-lg-6 row justify-content-center">
                        <div className="col-12">
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                {/* <div style={{textAlign : "center"}}> */}
                                <ReactPlayer
                                    url={contentList[0].videoArr[0].fileUrl}
                                    controls={true}
                                    pip={false}
                                    width="20rem"
                                    height="20rem"
                                    config={{
                                        file: {
                                            attributes: {
                                                onContextMenu: e => e.preventDefault(),
                                                controlsList: "nodownload"
                                            }
                                        }
                                    }}

                                // style={{ marginLeft: "auto", marginRight: "auto" }}
                                />
                                <div> Preview </div>
                                {!isPurchased &&
                                    <div style={{ fontSize: "2rem" }}>
                                        <BsCurrencyRupee /> {course.price}
                                    </div>
                                }
                                {/* (user.uid !== course.createdByID) && */}
                                {/* {user && */}
                                {!isPurchased &&
                                    <div className="button-div">
                                        <div>
                                            <button
                                                className="btn btn-primary"
                                                onClick={addToCart}
                                                disabled={disableAddToCart}
                                            >
                                                <AiOutlineShoppingCart
                                                    fontSize="1.2rem"
                                                /> &nbsp;
                                                Add to Cart</button>
                                            <button className="btn btn-danger"
                                                onClick={addToWishlist}
                                                disabled={disableAddToWishlist}
                                            // style={{ color : "white"}}
                                            >
                                                <BsFillSuitHeartFill
                                                    fontSize="1.2rem"
                                                />
                                            </button>

                                        </div>
                                    </div>
                                }
                                {isPurchased &&
                                    <div>
                                        <a
                                            className="btn btn-warning"
                                            style={{ margin: "1rem" }}
                                            href={`/course_view/${id}`}
                                        >
                                            <strong> Go to Course </strong>
                                        </a>

                                        <button
                                            className="btn btn-light"
                                            onClick={() => setReviewModalShow(true)}
                                        >
                                            <strong> Rate Course </strong>
                                        </button>
                                    </div>
                                }
                                {/* } */}

                            </div>
                            <div className="col-12 text-center">
                                <h3>Ratings & Reviews</h3>
                                {
                                    reviews &&
                                    <div className="container">
                                        <ReviewContainer reviews={reviews} />
                                    </div>
                                }
                                <button className="btn btn-primary"
                                    onClick={incrementReviewFetchLimit}
                                >More</button>
                            </div>

                        </div>


                    </div>
                </div>
            }

        </div>
    )
}

export default CourseDetails