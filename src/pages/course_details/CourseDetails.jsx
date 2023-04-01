import React, { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import videojs from "video.js";

// styles
import "./CourseDetails.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import ChapterAccordion from "../../components/ChapterAccordion"
import ReactPlayer from "react-player"
import { Rating } from "react-simple-star-rating"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// icons
import { BsFillSuitHeartFill } from "react-icons/bs"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { BsCurrencyRupee } from "react-icons/bs"


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

                    console.log(cart);

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

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on("waiting", () => {
            videojs.log("player is waiting");
        });

        player.on("dispose", () => {
            videojs.log("player will dispose");
        });
    };

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
                    <div className="col-12 col-lg-6 course-details">
                        <div style={{ textAlign: "center" }}>
                            <h1>{course.name}</h1>
                            <div>{course.creatorList.map((creator, index) => {
                                return <span key={index}>{creator}. </span>
                            })}</div>

                            <div className="rating-div" style={{ fontSize: "1rem" }}>
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
                                    <a
                                    className="btn btn-warning"
                                    style={{margin : "1rem"}}
                                    href={`/course_view/${id}`}
                                    >
                                   <strong> Go to Course </strong>
                                    </a>}
                                {/* } */}

                            </div>
                            <div className="col-12">
                                Reviews / Comment div
                            </div>

                        </div>


                    </div>
                </div>
            }

        </div>
    )
}

export default CourseDetails