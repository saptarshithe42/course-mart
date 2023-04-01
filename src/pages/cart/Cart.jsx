import React, { useState, useEffect } from "react"
import { projectFirestore, timestamp } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./Cart.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import Table from "react-bootstrap/Table";
import { toast, ToastContainer } from 'react-toastify';

// icons
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi"
import { useNavigate } from "react-router-dom"

function Cart() {

	const [isLoading, setIsLoading] = useState(false)
	const [cartIDArr, setCartIDArr] = useState([])
	const [cart, setCart] = useState([])
	const [totalPrice, setTotalPrice] = useState(0)

	const { user } = useAuthContext()
	const navigate = useNavigate()


	useEffect(() => {

		const fetchData = async () => {

			try {

				setIsLoading(true)

				const userRef = projectFirestore.collection("users").doc(user.uid)

				// fetching the data

				let cartIDs = (await userRef.get()).data().cart

				setCartIDArr(cartIDs)

				// fetch course entry for every ID

				const courseRef = projectFirestore.collection("courses")

				let arr = []
				let total = 0

				for (const courseID of cartIDs) {
					let doc = (await courseRef.doc(courseID).get())

					arr.push({ ...doc.data(), id: doc.id })

					total += Number(arr[arr.length - 1].price)
				}

				setCart(arr)
				setTotalPrice(total)
				setIsLoading(false)

				console.log(arr)


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

	const removeFromCart = async (id) => {

		try {

			let arr = cartIDArr.filter((courseID) => courseID !== id)

			const userRef = projectFirestore.collection("users").doc(user.uid)

			await userRef.update({
				cart: arr
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

	const processPayment = async () => {

		try {

			// add all the current cart items in purchasedCourses array 
			// and purchaseHistory arr of user
			const customerRef = projectFirestore.collection("users").doc(user.uid)

			let customerData = (await customerRef.get()).data()

			let purchasedCourses = customerData.purchasedCourses
			let purchaseHistory = customerData.purchaseHistory

			purchasedCourses = [...purchasedCourses, ...cartIDArr]
			let arr = [...purchaseHistory]

			cart.forEach((course) => {

				const historyObj = {
					id: course.id,
					name: course.name,
					price: course.price,
					creatorList: course.creatorList,
					dateOfPurchase: timestamp.fromDate(new Date())
				}

				arr.push(historyObj)
			})

			await customerRef.update({
				cart: [],
				purchasedCourses: purchasedCourses,
				purchaseHistory: arr
			})




			const courseRef = projectFirestore.collection("courses")
			const userRef = projectFirestore.collection("users")

			for (const course of cart) {

				// increment enrolledCount of each purchased course by 1
				await courseRef.doc(course.id).update({

					enrolledCount: (course.enrolledCount + 1)
				})

				// increment the earnings of their creators
				let userData = (await userRef.doc(course.createdByID).get()).data()

				let earnings = userData.earnings

				for (let i = 0; i < earnings.length; i++) {

					if (earnings[i].id === course.id) {
						earnings[i].earning += course.price
						break;
					}
				}

				await userRef.doc(course.createdByID).update({
					earnings: earnings
				})

			}

			toast.success("Payment Successful !", {
				position: "bottom-center",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
				progress: undefined,
				theme: "light",
			});


			navigate("/purchased_courses")


		} catch (err) {
			toast.error(err.message, {
				position: "top-center"
			})
		}

	}


	const tableStyle = {
		backgroundColor: "white",
		textAlign: "center"
	}


	return (
		<div className="cart-div container">
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

					<div className="cart-table-div">
						<h1 style={{ textAlign: "center", color: "white" }}>Cart</h1>
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
									<th>Remove</th>
								</tr>
							</thead>
							<tbody>
								{cart && cart.map((course, index) => {
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
											<td>
												{course.avgRating}
											</td>
											<td>{course.price}</td>
											<td style={{ textAlign: "center" }}>
												<AiOutlineCloseSquare
													className="close-button icon"
													onClick={() => { removeFromCart(course.id) }}
												/>
											</td>

										</tr>
									)
								})}
							</tbody>
						</Table>

						{(cart.length !== 0) &&
							<div className="cart-total-price-div">
								<div>Total : Rs {totalPrice}</div>
								<button className="btn"
									onClick={processPayment}
								>
									Pay
								</button>
							</div>}
					</div>
				</div>

			}
		</div>
	)
}

export default Cart