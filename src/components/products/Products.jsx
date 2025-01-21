import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "./product.css"
import { useNavigate } from 'react-router-dom';

function Products() {
  const user = sessionStorage.getItem('user');
  const admin = sessionStorage.getItem('admin');
  const navigate = useNavigate();
  useEffect(() => {
    if (user || !admin) {
      navigate("/")
    }
  }, [user,admin])

  const url = "http://localhost:3002/"
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [edit, setEdit] = useState(null)
  const [newProduct, setNewProduct] = useState({
    categorie: '',
    name: '',
    price: '',
  });

  useEffect(() => {
    axios.get(url + "categories").then((res) => {
      setCategories(res.data)
    })
  }, [user,admin])

  useEffect(() => {
    axios.get(url + "products").then((res) => {
      let main = [];
      res.data.forEach(category => {
        main = [...main, ...category.products]
      });
      setProducts(main)
    })
  }, [categories])

  useEffect(() => {
    console.log(edit);
  }, [edit])

  const addProduct = async () => {
    try {
      const existingCategory = categories.find(cat => cat.name === newProduct.categorie);
      let categoryId;

      if (!existingCategory) {
        const newCategory = { id: Date.now().toString(), name: newProduct.categorie };
        await axios.post(url + "categories", newCategory);
        setCategories([...categories, newCategory]);
        categoryId = newCategory.id;
        await axios.post(url + "products", { id: categoryId, categorie: newProduct.categorie, products: [] });
      } else {
        categoryId = existingCategory.id;
      }
      const categoryResponse = await axios.get(url + `products?categorie=${newProduct.categorie}`);
      let categoryData = categoryResponse.data[0];

      if (!categoryData) {
        categoryData = { id: categoryId, categorie: newProduct.categorie, products: [] };
      }

      categoryData.products.push({
        id: Date.now().toString(),
        ...newProduct
      });
      await axios.put(url + `products/${categoryData.id}`, categoryData);

      alert("Product added successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  }


  const deleteProduct = async (product) => {
    try {
      const categoryResponse = await axios.get(url + `products?categorie=${product.categorie}`);
      const categoryData = categoryResponse.data[0];

      if (categoryData) {
        categoryData.products = categoryData.products.filter(p => p.id !== product.id);
        await axios.put(url + `products/${categoryData.id}`, categoryData);
        setProducts(products.filter(p => p.id !== product.id));
        alert("Product deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  }

  const editProduct = async () => {
    try {
      const categoryResponse = await axios.get(url + `products?categorie=${edit.categorie}`);
      const categoryData = categoryResponse.data[0];

      if (categoryData) {
        categoryData.products = categoryData.products.map(p => p.id === edit.id ? edit : p);
        await axios.put(url + `products/${categoryData.id}`, categoryData);
        setProducts(products.map(p => p.id === edit.id ? edit : p));
        alert("Product updated successfully!");
        setEdit(null);
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  }

  return (
    <div>
      <h3>Products</h3>
      <table className='table'>
        <thead className='table-info'>
          <tr>
            <th scope="col">Categorie</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody className='table-light'>
          {
            products.map((el) => (
              <tr key={el.id}>
                <th>{el.categorie}</th>
                <th>{el.name}</th>
                <th>{el.price}֏</th>
                <th>
                  <button className='btn btn-success' onClick={() => setEdit(el)}>
                    Edit
                  </button>
                </th>
                <th>
                  <button className='btn btn-danger' onClick={() => deleteProduct(el)}>
                    Delete
                  </button>
                </th>
              </tr>
            ))
          }
        </tbody>
      </table>

      <h4>Add New Product</h4>
      <form id="addProductForm">
        <div className="form-floating mb-3 flo">
          <input
            type="text"
            className="form-control"
            placeholder="Categorie"
            value={newProduct.categorie}
            onChange={(e) => setNewProduct({ ...newProduct, categorie: e.target.value })}
          />
          <label>Categorie</label>
        </div>
        <div className="form-floating mb-3 flo">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <label>Name</label>
        </div>
        <div className="form-floating mb-3 flo">
          <input
            type="text"
            className="form-control"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <label>Price</label>
        </div>
      </form>

      <button className='btn btn-primary' onClick={addProduct}>Add Product</button>

      {edit && (
        <div className="edit-section">
          <h4>Editing Product</h4>
          <form id="editForm">
            <div className="form-floating mb-3 flo">
              <input
                type="text"
                className="form-control"
                placeholder="Categorie"
                value={edit.categorie}
                onChange={(e) => setEdit({ ...edit, categorie: e.target.value })}
              />
              <label>Categorie</label>
            </div>
            <div className="form-floating mb-3 flo">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              />
              <label>Name</label>
            </div>
            <div className="form-floating mb-3 flo">
              <input
                type="text"
                className="form-control"
                placeholder="Price"
                value={edit.price}
                onChange={(e) => setEdit({ ...edit, price: e.target.value })}
              />
              <label>Price</label>
            </div>
          </form>

          <button className='btn btn-success' onClick={editProduct}>Save</button>
          <button className="btn btn-secondary" onClick={() => setEdit(null)}>Cancel</button>
        </div>
      )}
    </div>
  )
}

export default Products;
