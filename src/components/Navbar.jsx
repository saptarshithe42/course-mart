import { Link, useNavigate } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

// styles & images
import './Navbar.css'

// icons
import { FaUserCircle } from "react-icons/fa"
import { FiBookOpen } from "react-icons/fi"
import { ImBooks } from "react-icons/im"
import {RxVideo} from "react-icons/rx"

// components
import OffCanvas from './OffCanvas'


function Navbar() {

	const { logout, isPending } = useLogout()
	const { user } = useAuthContext()
	const navigate = useNavigate()

	const userIcon = {
		fontSize: "1.5rem",
		// color : "white"
	}

	const handleLogout = async () => {

		await logout()

		navigate("/")
	}

	return (

		<nav className="navbar navbar-expand-md bg-dark">
			<div className="container-fluid">
				<a className="navbar-brand" href="/"> <RxVideo /> Course Mart</a>
				<button className="navbar-toggler" style={{ backgroundColor: "white" }} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon" ></span>
				</button>
				<div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
					{!user &&
						<ul className="nav">
							<li className="nav-item btn btn-outline-primary"><Link to="/login">Login</Link></li>
							<li className="nav-item btn btn-outline-primary"><Link to="/signup">Signup</Link></li>
						</ul>
					}

					{user &&
						<ul className="nav">
							<li className="nav-item btn btn-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
								Profile <FaUserCircle style={userIcon} />
								{/* <OffCanvas /> */}
							</li>
							<li className="nav-item">
								{!isPending && <button className="btn btn-outline-success" onClick={handleLogout} style={{ color: "white" }}>Logout</button>}
								{isPending && <button className="btn btn-outline-success" disabled>Logging out...</button>}
							</li>
						</ul>
					}
				</div>
			</div>
		</nav>
	)
}

export default Navbar