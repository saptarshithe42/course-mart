import React, { useState, useEffect } from "react"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./PurchaseHistory.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import Table from "react-bootstrap/Table";
import { toast, ToastContainer } from 'react-toastify';

// icons
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi"
import { useNavigate } from "react-router-dom"

function PurchaseHistory() {

	const [isLoading, setIsLoading] = useState(false)
	const [purchasedIDArr, setPurchasedIDArr] = useState([])
	const [purchaseHistoryArr, setPurchaseHistoryArr] = useState([])

	const { user } = useAuthContext()
	const navigate = useNavigate()


	useEffect(() => {

		const fetchData = async () => {

			try {

				setIsLoading(true)

				const userRef = projectFirestore.collection("users").doc(user.uid)

				let userData = (await userRef.get()).data()

				setPurchaseHistoryArr(userData.purchaseHistory)
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


	const tableStyle = {
		backgroundColor: "white",
		textAlign: "center",
		marginTop : "1rem"
	}


	return (
		<div className="purchase-history-div container">
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

					<div className="purchase-history-table-div">
						<h1 style={{ textAlign: "center", color: "white" }}>Purchase History</h1>
						<Table
							striped
							bordered
							responsive
							style={tableStyle}>
							<thead>
								<tr>
									<th>Name</th>
									<th>Price (Rs.)</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{purchaseHistoryArr &&
									purchaseHistoryArr.map((course, index) => {
										return (
											<tr key={index}>
												<td>
													<a href={`/course_details/${course.id}`} target="_blank">
														{course.name} <BiLinkExternal />
													</a>
												</td>
												<td>{course.price}</td>
												<td>
													{new Date((course.dateOfPurchase.toDate())).getDate()}/{new Date((course.dateOfPurchase.toDate())).getMonth()}/{new Date((course.dateOfPurchase.toDate())).getFullYear()}
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

export default PurchaseHistory