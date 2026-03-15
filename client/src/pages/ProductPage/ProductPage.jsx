import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa"; 
import "./ProductPage.css"; 
import { useOutletContext } from "react-router-dom";

const ProductPage = () => {
  const { products, suppliers, refreshData, addProduct } = useOutletContext();

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", category: "", stock_quantity: "", price: "", supplier_id: ""
  });

  
  useEffect(() => {
    if (!products || products.length === 0) {
      setDisplayedProducts([]);
      setLoading(false);
      return;
    }

    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter(product =>
        (product.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(product =>
        (product.name || "").toLowerCase().includes(lowerTerm) ||
        (product.category || "").toLowerCase().includes(lowerTerm)
      );
    }

    setDisplayedProducts(result);
    setLoading(false);
  }, [products, searchTerm, selectedCategory]);

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
      supplier_id: parseInt(newProduct.supplier_id)
    };

    try {
      const response = await fetch('/api/products', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToAdd),
      });

      if (response.ok) {
        // Refresh all data from the server
        // if (refreshData) refreshData();
        const savedProduct = await response.json();
        const newObj = savedProduct.data || savedProduct;
        addProduct(newObj)
        setIsModalOpen(false);
        setNewProduct({ name: "", category: "", stock_quantity: "", price: "", supplier_id: "" });
      } else {
        const err = await response.json();
        alert(err.error || "Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    }
  };

  const nonDuplicateCategory = [...new Set(products.map(item => item.category))].filter(Boolean);
  const renderCategories = nonDuplicateCategory.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ));

  const renderSuppliers = suppliers.map(sup => (
    <option key={sup.id} value={sup.id}>{sup.name}</option>
  ));

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
              {["All", ...nonDuplicateCategory].map(cat => (
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
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No products found. Try changing the category or search term.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-btn"><FaTimes /></button>
            </div>
            <form onSubmit={handleAddProduct} className="modal-form">
              <input
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="category">Category:
                <select
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
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
              <input
                type="number"
                name="stock_quantity"
                placeholder="Stock"
                value={newProduct.stock_quantity}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="btn-add" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;