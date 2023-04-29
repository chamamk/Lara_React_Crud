import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
    const location=useLocation()
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">Laravel React Crud</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname ==='/' ? 'active' :'' }`} aria-current="page" to="/"><i className="fa-solid fa-house"></i>Home</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link className="nav-link" to="#">About</Link>
                        </li> */}
                        {/* <li className="nav-item">
                            <Link className={`nav-link ${location.pathname ==='/edit' ? 'active' :'' }`} to="/edit"><i className="fa-solid fa-pen-to-square"></i>Edit</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname ==='/create' ? 'active' :'' }`} to="/create"><i className="fa-solid fa-plus"></i>Create Task</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname ==='/task' ? 'active' :'' }`} to="/task"><i className="fa-solid fa-list-check"></i>Task</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </div>
    )
}

export default Navbar
