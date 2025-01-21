import React from 'react'
import { useNavigate } from 'react-router-dom';

function AdminNav() {
    const navigate = useNavigate();

    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a href="/admin" className='nav-link active'>
                    <h1 style={{
                        fontFamily: "'Sacramento', serif",
                        fontWeight: "800"
                    }}>Las Vedias</h1>
                </a>
                <a href="/products" className='nav-link active'>Products</a>
                <a href="/cashbox" className='nav-link active'>Cashbox</a>
                <button className='btn btn-warning' onClick={() => {
                    sessionStorage.removeItem('admin');
                    sessionStorage.removeItem('user');
                    navigate("/")
                }}>Logout</button>
            </div>
        </nav>
    )
}

export default AdminNav