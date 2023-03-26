import React from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import ProfilePicture from "./ProfilePicture"

// styles
import "./OffCanvas.css"
import { NavLink } from "react-router-dom"

// icons
import { AiOutlineStar } from "react-icons/ai"
import { AiOutlineUpload } from "react-icons/ai"
import { AiOutlineDownload } from "react-icons/ai"
import { AiOutlineHome } from "react-icons/ai"
import {MdVideoLibrary} from "react-icons/md"
import {RiVideoAddLine} from "react-icons/ri"
import {AiOutlineShoppingCart} from "react-icons/ai"
import {AiFillHeart} from "react-icons/ai"
import {RiHistoryFill} from "react-icons/ri"
import {RiDraftLine} from "react-icons/ri"

function OffCanvas() {

    const { user } = useAuthContext()

    const closeBtnStyle = {
        marginLeft: "auto",
        marginTop: "1rem",
        marginRight: "1rem",
        backgroundColor: "white"
    }

    return (
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <button type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                style={closeBtnStyle}
            ></button>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
                    <ProfilePicture
                        src={user.photoURL}
                        displayName={user.displayName}
                    />
                    {/* <p>{user.displayName}</p> */}
                </h5>
            </div>

            <div className="offcanvas-body">
                <ul className="offcanvas-options-list">
                    <li data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                        <NavLink to="/" className="nav-link-item">
                            <AiOutlineHome className="offcanvas-icons" />  Dashboard
                        </NavLink>
                    </li>
                    <li data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                        <NavLink to="/wishlist" className="nav-link-item">
                            <AiFillHeart className="offcanvas-icons" />   Wishlist
                        </NavLink>
                    </li>
                    <li data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                        <NavLink to="/cart" className="nav-link-item">
                            <AiOutlineShoppingCart className="offcanvas-icons" />   Cart
                        </NavLink>
                    </li>
                    <li data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                        <NavLink to="/purchased_courses" className="nav-link-item">
                            <MdVideoLibrary className="offcanvas-icons" />  Purchased Courses
                        </NavLink>
                    </li>
                    <li data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                        <NavLink to="/create" className="nav-link-item">
                            <RiVideoAddLine className="offcanvas-icons" />  Create Course
                        </NavLink>
                    </li>
                    <li data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                        <NavLink to="/drafts" className="nav-link-item">
                            <RiDraftLine className="offcanvas-icons" />  Drafts
                        </NavLink>
                    </li>
                    <li data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                        <NavLink to="/published_courses" className="nav-link-item">
                            <AiOutlineUpload className="offcanvas-icons" />  Published Courses
                        </NavLink>
                    </li>
                    <li data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                        <NavLink to="/purchase_history" className="nav-link-item">
                            <RiHistoryFill className="offcanvas-icons" />  Purchase History
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default OffCanvas