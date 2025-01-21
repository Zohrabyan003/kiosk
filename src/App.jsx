import { useRoutes } from 'react-router-dom'
import "./App.css"
import Nav from './components/nav/Nav'
import Login from './components/login/Login'
import Shop from './components/shop/Shop'
import Admin from './components/admin/Admin'
import AdminNav from './components/adminNav/AdminNav'
import Products from './components/products/Products'
import Cashbox from './components/cashbox/Cashbox'
function App() {
  const admin = sessionStorage.getItem('admin');
  const user = sessionStorage.getItem('user');
  let element = useRoutes([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/shop",
      element: <Shop />
    },
    {
      path: "/admin",
      element: <Admin />
    },
    {
      path: "/products",
      element: <Products />
    },
    {
      path: "/cashbox",
      element: <Cashbox />
    },
  ])


  return (
    <div>
      <div id="nav">
        {user ? <Nav /> : admin && <AdminNav />}
      </div>
      <div className='main'>
        {element}
      </div>
    </div >
  );
}

export default App;