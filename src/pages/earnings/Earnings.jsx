import React, { useState, useEffect } from "react"
import { projectFirestore } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import "./Earnings.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import Table from "react-bootstrap/Table";
import { toast, ToastContainer } from 'react-toastify';

// icons
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi"
import { useNavigate } from "react-router-dom"

function Earnings() {

	const [isLoading, setIsLoading] = useState(false)
	const [earningsArr, setEarningsArr] = useState([])

	const { user } = useAuthContext()
	const navigate = useNavigate()


	useEffect(() => {

		const fetchData = async () => {

			try {

				setIsLoading(true)

				const userRef = projectFirestore.collection("users").doc(user.uid)

				let userData = (await userRef.get()).data()

				setEarningsArr(userData.earnings)
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
		<div className="earning-div container">
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

					<div className="earning-table-div">
						<h1 style={{ textAlign: "center", color: "white" }}>Earnings</h1>
						<Table
							striped
							bordered
							responsive
							style={tableStyle}>
							<thead>
								<tr>
									<th>Name</th>
									<th>Earning (Rs.)</th>
								</tr>
							</thead>
							<tbody>
								{earningsArr &&
									earningsArr.map((course, index) => {
										return (
											<tr key={index}>
												<td>
													<a href={`/course_details/${course.id}`} target="_blank">
														{course.name} <BiLinkExternal />
													</a>
												</td>
												<td>{course.earning}</td>
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

export default Earnings