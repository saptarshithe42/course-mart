import React, { useState, useEffect } from "react"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./Wishlist.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import Table from "react-bootstrap/Table";
import { toast, ToastContainer } from 'react-toastify';

// icons
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi"
import { BiCartAdd } from "react-icons/bi"

function Wishlist() {

    const [isLoading, setIsLoading] = useState(false)
    const [wishlistIDArr, setWishlistIDArr] = useState([])
    const [cartIDArr, setCartIDArr] = useState([])
    const [wishlist, setWishlist] = useState([])

    const { user } = useAuthContext()


    useEffect(() => {

        const fetchData = async () => {

            try {

                setIsLoading(true)

                const userRef = projectFirestore.collection("users").doc(user.uid)

                // fetching the data

                let userData = (await userRef.get()).data()

                let wishlistIDs = userData.wishlist

                setCartIDArr(userData.cart)

                setWishlistIDArr(wishlistIDs)

                // fetch course entry for every ID

                const courseRef = projectFirestore.collection("courses")

                let arr = []

                for (const courseID of wishlistIDs) {
                    let doc = (await courseRef.doc(courseID).get())

                    arr.push({ ...doc.data(), id: doc.id })
                }

                setWishlist(arr)
                setIsLoading(false)

            } catch (err) {

                toast.error(err.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }

        fetchData()

    }, [])

    const removeFromWishlist = async (id) => {

        try {

            let arr = wishlistIDArr.filter((courseID) => courseID !== id)

            const userRef = projectFirestore.collection("users").doc(user.uid)

            await userRef.update({
                wishlist: arr
            })

            window.location.reload(true);


        } catch (err) {
            toast.error(err.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }


    }

    const addToCart = async (id) => {

        try {

            let arr = wishlistIDArr.filter((courseID) => courseID !== id)

            const userRef = projectFirestore.collection("users").doc(user.uid)

            let newCart = [...cartIDArr, id]

            await userRef.update({
                wishlist: arr,
                cart : newCart
            })

            window.location.reload(true);


        } catch (err) {
            toast.error(err.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

    }

    const tableStyle = {
        backgroundColor: "white",
        marginTop: "1.5rem",
        textAlign: "center"
    }


    return (
        <div className="wishlist-div container">
            {isLoading ? <LoadingAnimation /> :

                <div className="container">
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover={false}
                        theme="light"
                    />

                    <div className="wishlist-table-div">
                        <h1 style={{ textAlign: "center", color: "white" }}>Wishlist</h1>
                        <Table
                            striped
                            bordered
                            responsive
                            style={tableStyle}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Instructors</th>
                                    <th>Rating</th>
                                    <th>Price</th>
                                    <th>Add To Cart</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlist.map((course, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <a href={`/course_details/${course.id}`} target="_blank">
                                                    {course.name} <BiLinkExternal />
                                                </a>
                                            </td>
                                            <td>{course.creatorList.map((name, index) => {
                                                return (<div key={index}>{name}</div>)
                                            })}</td>
                                            <td>{course.avgRating}</td>
                                            <td>{course.price}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <BiCartAdd
                                                    className="add-to-cart-btn icon"
                                                    onClick={() => { addToCart(course.id) }}
                                                />
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <AiOutlineCloseSquare
                                                    className="close-button icon"
                                                    onClick={() => { removeFromWishlist(course.id) }}
                                                />
                                            </td>

                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>

            }
        </div>
    )
}

export default Wishlist