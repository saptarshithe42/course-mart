
import { useAuthContext } from "../hooks/useAuthContext"

// styles & images
import "./Sidebar.css"
import DashboardIcon from "../assets/dashboard_icon.svg"
import AddIcon from "../assets/add_icon.svg"

import React from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
const Sidebar = () => {

    const {user} = useAuthContext()

    return (
        <div
            style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}
        >
            <CDBSidebar textColor="#fff" backgroundColor="#333">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <a
                        href="/"
                        className="text-decoration-none"
                        style={{ color: 'inherit' }}
                    >
                        {user.displayName}
                    </a>
                </CDBSidebarHeader>
                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavLink exact to="/" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/create" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="table">New Question Paper</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/exam" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="user">Give Exam</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/history" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="history">Test History</CDBSidebarMenuItem>
                        </NavLink>
                        {/* <NavLink exact to="/reports" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="file">Reports</CDBSidebarMenuItem>
                        </NavLink> */}
                        {/* <NavLink exact to="/analytics" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="chart-line">
                                Analytics
                            </CDBSidebarMenuItem>
                        </NavLink> */}
                        {/* <NavLink
                            exact
                            to="/hero404"
                            target="_blank"
                            activeClassName="activeClicked"
                        >
                            <CDBSidebarMenuItem icon="exclamation-circle">
                                404 page
                            </CDBSidebarMenuItem>
                        </NavLink> */}
                    </CDBSidebarMenu>
                </CDBSidebarContent>
                {/* <CDBSidebarFooter style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            padding: '20px 5px',
                        }}
                    >
                        Sidebar Footer
                    </div>
                </CDBSidebarFooter> */}
            </CDBSidebar>
        </div>
    );
};
export default Sidebar;

// function Sidebar() {

//     const { user } = useAuthContext();

//     return (
//         <div className="sidebar">
//             <div className="sidebar-content">
//                 <div className="user">
//                     <Avatar src={user.photoURL} />
//                     <p>Hey {user.displayName}</p>
//                 </div>
//                 <nav className="links">
//                     <ul>
//                         <li>
//                             <NavLink exact to="/">
//                                 <img src={DashboardIcon} alt="dashboard icon" />
//                                 <span>Your Question Papers</span>
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink to="/create">
//                                 <img src={AddIcon} alt="add question paper icon" />
//                                 <span>New Question Paper</span>
//                             </NavLink>
//                         </li>

//                         <li>
//                             <NavLink to="/exam">
//                                 <img src={AddIcon} alt="give exam" />
//                                 <span>Give Exam</span>
//                             </NavLink>
//                         </li>
//                     </ul>
//                 </nav>
//             </div>
//         </div>
//     )
// }

// export default Sidebar