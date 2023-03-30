import React, { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import LoadingAnimation from "../../components/LoadingAnimation"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import videojs from "video.js";

// styles
import "./CourseDetails.css"

// components
import ChapterAccordion from "../../components/ChapterAccordion"
import ReactPlayer from "react-player"
import { Rating } from "react-simple-star-rating"
import Toast from "react-bootstrap/Toast";

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

                setContentList(courseContent.content)
                setIsLoading(false)
            } catch (err) {

                setIsLoading(false)
                alert(err)

            }
        }

        // fetching book
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

        // adding current course ID to user's cart array
        const userRef = projectFirestore.collection("users").doc(user.uid)

        let cart = (await userRef.get()).data().cart

        cart.push(id)

        await userRef.update({
            cart: cart
        })

        setAddedToCart(true)
        setDisableAddToCart(true)

    }

    const addToWishlist = async () => {
        // adding current course ID to user's cart array
        const userRef = projectFirestore.collection("users").doc(user.uid)

        let wishlist = (await userRef.get()).data().wishlist

        wishlist.push(id)

        await userRef.update({
            wishlist : wishlist
        })

        setAddedToWishlist(true)
        setDisableAddToWishlist(true)
        
    }



    return (
        <div className="container course-details-container">
            {isLoading ? <LoadingAnimation /> :
                <div className="row course-details-holder" style={{ color: "white" }}>

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
                                <div style={{ fontSize: "2rem" }}>
                                    <BsCurrencyRupee /> {course.price}
                                </div>
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
                                <Toast
                                    show={addedToCart}
                                    delay={5000}
                                    bg="Light"
                                    onClose={() => { setAddedToCart(false) }}
                                    style={{ width: "15rem" }}
                                >
                                    <Toast.Header>
                                        <strong className="me-auto">{course.name}</strong>
                                    </Toast.Header>
                                    <Toast.Body>
                                        <div style={{ color: "black" }}>
                                            Added to Cart !
                                        </div>
                                    </Toast.Body>
                                </Toast>

                                <Toast
                                    show={addedToWishlist}
                                    delay={5000}
                                    bg="Light"
                                    onClose={() => { setAddedToWishlist(false) }}
                                    style={{ width: "15rem" }}
                                >
                                    <Toast.Header>
                                        <strong className="me-auto">{course.name}</strong>
                                    </Toast.Header>
                                    <Toast.Body>
                                        <div style={{ color: "black" }}>
                                            Added to Wishlist !
                                        </div>
                                    </Toast.Body>
                                </Toast>
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