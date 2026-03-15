import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa"; 
import "./ProductPage.css"; 
import { useOutletContext } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';

const ProductPage = () => {
  const APIBaseurl = "/api";

  const [masterProductList, setMasterProductList] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", category: "", stock_quantity: "", price: "", supplier_id:""
  });
  const {products, suppliers}=useOutletContext()

  // INITIAL FETCH 
  useEffect(() => {
    fetch(`${APIBaseurl}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((responseBody) => {
        // Look for 'data' key based on your console output
        const actualList = responseBody.data || [];
        setMasterProductList(actualList);
        setDisplayedProducts(actualList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
        setMasterProductList([]);
        setDisplayedProducts([]);
      });
  }, [APIBaseurl]);

  // FILTERING LOGIC 
  useEffect(() => {
    let result = [...masterProductList];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(product => {
        const prodCat = (product.category || "").toLowerCase();
        const selectedCat = selectedCategory.toLowerCase();
        return prodCat === selectedCat;
      });
    }

    // Filter by Search Term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(product => 
        (product.name || "").toLowerCase().includes(lowerTerm) ||
        (product.category || "").toLowerCase().includes(lowerTerm)
      );
    }

    setDisplayedProducts(result);
  }, [searchTerm, selectedCategory, masterProductList]);

  // HANDLERS 
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const productToAdd = {
      name: newProduct.name,
      category: newProduct.category,
      stock_quantity: parseInt(newProduct.stock_quantity) || 0,
      price: parseFloat(newProduct.price) || 0,
      supplier_id:parseInt(newProduct.supplier_id)
    };

    try {
      const response = await fetch(`${APIBaseurl}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToAdd),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        // Backend usually returns the new object inside a 'data' wrapper or directly
        const newObj = savedProduct.data || savedProduct;
        setMasterProductList(prev => [newObj, ...prev]);
        setIsModalOpen(false);
        setNewProduct({ name: "", category: "", stock_quantity: "", price: "", supplier_id:"" });
      }
    } catch (error) {
      console.log(error)
      alert("Failed to add product.");
    }
  };
  const nonDuplicateCategory = [...new Set(products.map(item => item.category))].filter(Boolean)
  const renderCategories = nonDuplicateCategory.map(cat=>{
        return(
            <option key={cat} value={cat}>{cat}</option>
        )
    })

    const renderSuppliers=suppliers.map(sup=>{
      return(
        <option key={sup.id} value={sup.id}>{sup.name}</option>
      )
    })

  return (
    <div className="product-page-container">
      <div className="page-header">
        <h1 className="page-title">Product Inventory</h1>
        <div className="header-actions">
          <div className="search-bar-container">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="controls-section">
        <button className="btn-add" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Add product
        </button>
        
        <div className="category-dropdown-container">
          <button 
            className="btn-category" 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
             {selectedCategory === "All" ? "Categories" : selectedCategory} ▼
          </button>

          {isCategoryOpen && (
            <div className="dropdown-menu">
              {["All", "Electronics", "Office", "Home"].map(cat => (
                <div key={cat} className="dropdown-item" onClick={() => handleCategorySelect(cat)}>
                  {cat === "All" ? "All Categories" : cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="table-card">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th className="text-center">Stock Quantity</th>
              <th className="text-right">$ Price</th>
              <th className="text-right">$ Total Worth</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center">Loading inventory...</td></tr>
            ) : (
              displayedProducts.map((product) => {
                // Determine stock value from whichever key the backend uses
                const currentStock = product.stock ?? product.stock_quantity ?? 0;
                const currentPrice = product.price ?? 0;
                
                return (
                  <tr key={product.id}>
                    <td className="product-name">{product.name || "N/A"}</td>
                    <td>{product.category || "General"}</td>
                    <td className="text-center">{currentStock}</td>
                    <td className="text-right">{Number(currentPrice).toLocaleString()}</td>
                    <td className="text-right font-bold">
                      {(Number(currentPrice) * Number(currentStock)).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {!loading && displayedProducts.length === 0 && (
          <div style={{padding: '2rem', textAlign: 'center', color: '#888'}}>
            No products found. Try changing the category or search term.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-btn"><FaTimes/></button>
            </div>
            <form onSubmit={handleAddProduct} className="modal-form">
              
              <input id='name' name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} required />
              <label htmlFor="category">Category: 
                <select id='category' 
                  name="category" 
                  value={newProduct.category} 
                  onChange={handleInputChange} 
                  required
                >
                  <option>Select Category</option>
                  {renderCategories}
                </select>
              </label>
              <label htmlFor="supplier_id">Supplier:
                <select
                  id="supplier_id"
                  name="supplier_id"
                  value={newProduct.supplier_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Supplier</option>
                  {renderSuppliers}
                </select>
              </label>
              <input type="number" name="stock_quantity" placeholder="Stock" value={newProduct.stock_quantity} onChange={handleInputChange} required />
              <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} required />
              
              <button type="submit" className="btn-add" style={{justifyContent:'center', marginTop:'1rem'}}>Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;