import React, { useState, useEffect } from "react"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./Cart.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import Table from "react-bootstrap/Table";
import { toast, ToastContainer } from 'react-toastify';

// icons
import { AiOutlineCloseSquare } from "react-icons/ai";

function Cart() {

	const [isLoading, setIsLoading] = useState(false)
	const [cartIDArr, setCartIDArr] = useState([])
	const [cart, setCart] = useState([])
	const [totalPrice, setTotalPrice] = useState(0)

	const { user } = useAuthContext()


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
				cart : arr
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
						<Table striped bordered style={{ backgroundColor: "white" }}>
							<thead>
								<tr>
									<th>Name</th>
									<th>Instructors</th>
									<th>Rating</th>
									<th>Price</th>
								</tr>
							</thead>
							<tbody>
								{cart.map((course, index) => {
									return (
										<tr>
											<td>{course.name}</td>
											<td>{course.creatorList.map((name, index) => {
												return (<span>{name}</span>)
											})}</td>
											<td>{course.avgRating}</td>
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

						<div className="cart-total-price-div">
							<div>Total : Rs {totalPrice}</div>
							<button className="btn">Pay</button>
						</div>
					</div>
				</div>

			}
		</div>
	)
}

export default Cart