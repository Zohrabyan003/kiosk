import React from 'react'
import { useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate();

    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <h1 style={{
                    fontFamily: "'Sacramento', serif",
                    fontWeight: "800"
                }}>Las Vedias</h1>
                <button className='btn btn-warning' onClick={() => {
                    sessionStorage.removeItem('admin');
                    sessionStorage.removeItem('user');
                    navigate("/")
                }}>Logout</button>
            </div>
        </nav>

    )
}

export default Nav