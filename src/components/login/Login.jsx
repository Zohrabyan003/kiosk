import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    let url = "http://localhost:3002/users"
    let [users, setUsers] = useState([])
    const admin = sessionStorage.getItem('admin');
    const user = sessionStorage.getItem('user');
    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (admin) {
            navigate("/admin")
        } else if (user) {
            navigate("/shop")
        } else {
            axios.get(url).then((res) => setUsers(res.data))

        }
    }, [admin,user,navigate])
    function checkUser() {
        let check = false
        let userid = ""
        let usertype = ""
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username && users[i].password === password) {
                check = true
                userid = users[i].id
                usertype = users[i].type
                break
            }

        }
        return [check, userid, usertype]
    }
    function login() {
        let check = checkUser()
        if (check[0] === true) {
            if (check[2] === "admin") {
                navigate('/admin')
                sessionStorage.setItem('admin', JSON.stringify(check[1]));

            } else {
                sessionStorage.setItem('user', check[1]);
                navigate('/shop')
            }
        }
    }
    return (
        <div className='login'>
            <form style={{ width: '250px'}} action="" onSubmit={(e) => {
                e.preventDefault()
                login()
            }}>
                <input className='form-control' type="text" placeholder="Username" onChange={(e) => {
                    setUsername(e.target.value)
                }} />
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="form-control"
                        style={{ paddingRight: '40px' }}
                    />
                    <span
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            fontSize: '18px',
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? '👁️' : '🙈'}
                    </span>
                </div>
                    <button type='submit' className='btn btn-primary form-control'>Login</button>
            </form>
        </div>
    )
}

export default Login