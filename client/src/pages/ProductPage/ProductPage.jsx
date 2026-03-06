import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa"; 
import "./ProductPage.css"; 

const ProductPage = () => {
  const APIBaseurl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const [masterProductList, setMasterProductList] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", category: "", stock: "", price: ""
  });

  //INITIAL FETCH 
  useEffect(() => {
    fetch(`${APIBaseurl}/products`)
      .then((res) => res.json())
      .then((data) => {
        setMasterProductList(data);  // Save the full list
        setDisplayedProducts(data);  // Show the full list initially
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [APIBaseurl]);

  //FILTERING LOGIC 
  useEffect(() => {
    let result = masterProductList;

    //Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }

    //Filter by Search Term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(product => 
        
        product.name.toLowerCase().includes(lowerTerm) ||
        product.category.toLowerCase().includes(lowerTerm)
      );
    }

    setDisplayedProducts(result);
  }, [searchTerm, selectedCategory, masterProductList]);


  //HANDLERS 
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
      stock: parseInt(newProduct.stock) || 0,
      price: parseInt(newProduct.price) || 0,
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      sales: [], suppliers: [], alerts: [],
      last_updated: new Date().toDateString()
    };

    try {
      const response = await fetch(`${APIBaseurl}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToAdd),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        
        // Update both lists so the new product appears immediately
        const updatedList = [savedProduct, ...masterProductList];
        setMasterProductList(updatedList);

        
        setIsModalOpen(false);
        setNewProduct({ name: "", category: "", stock: "", price: "" });
      }
    } catch (error) {
      alert("Failed to add product.");
    }
  };

  return (
    <div className="product-page-container">
      
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Product Inventory</h1>
        
        {/* Search Bar */}
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

      {/* Controls */}
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
              <div className="dropdown-item" onClick={() => handleCategorySelect("All")}>All Categories</div>
              <div className="dropdown-item" onClick={() => handleCategorySelect("Electronics")}>Electronics</div>
              <div className="dropdown-item" onClick={() => handleCategorySelect("Office")}>Office</div>
              <div className="dropdown-item" onClick={() => handleCategorySelect("Home")}>Home</div>
            </div>
          )}
        </div>
      </div>

      {/* Product Table */}
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
              displayedProducts.map((product) => (
                <tr key={product.id || Math.random()}>
                  <td className="product-name">{product.name}</td>
                  <td>{product.category}</td>
                  <td className="text-center">{product.stock}</td>
                  <td className="text-right">{Number(product.price).toLocaleString()}</td>
                  <td className="text-right font-bold">
                    {(Number(product.price) * Number(product.stock)).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {!loading && displayedProducts.length === 0 && (
          <div style={{padding: '2rem', textAlign: 'center', color: '#888'}}>
            No products found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-btn"><FaTimes/></button>
            </div>
            <form onSubmit={handleAddProduct} className="modal-form">
              <input name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} required />
              <select name="category" value={newProduct.category} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Office">Office</option>
                <option value="Home">Home</option>
              </select>
              <input type="number" name="stock" placeholder="Stock" value={newProduct.stock} onChange={handleInputChange} required />
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