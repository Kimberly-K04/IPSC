import React, { useState } from 'react'
import { useOutletContext, Navigate } from 'react-router-dom'
import './Dashboard.css'
import DashBoardInventory from './components/DashBoardInventory'
import Selector from './components/Selector'
import DashForecast from './components/DashForecast'
import Barchart from './components/Barchart'

function Dashboard() {
  const [filter, setFilter] = useState('')
  const context = useOutletContext() || {}
  
  // Safe defaults to prevent errors if context is still loading
  const { user, products = [], alerts = [], sales = [] } = context

  // Keep the team's redirect logic if user session is lost
  if (!user && !context.loading) return <Navigate to='/login'/>

  // 1. Safe Filtering logic (Your fix)
  const filteredProducts = products.filter(pro => {
    if (filter === "") return true
    return (pro.category || "").toLowerCase() === filter.toLowerCase()
  })

  // Get categories for the selector, avoiding duplicates and nulls
  const nonDuplicateCategory = [...new Set(products.map(item => item.category))].filter(Boolean)

  // 2. Safe Summary Calculations (Prevents Robot crash)
  function calculateSummaryProducts(data) {
    let TotalStock = 0
    let totalDemand = 0
    if (Array.isArray(data)) {
      data.forEach(item => {
        totalDemand += item.demandForecast || item.demand_forecast || 0
        TotalStock += item.stock || item.stock_quantity || 0
      })
    }
    return { TotalStock, totalDemand }
  }

  const { TotalStock, totalDemand } = calculateSummaryProducts(products)

  function calculateSummaryAlerts(data) {
    return Array.isArray(data) ? data.length : 0
  }

  function calculateSummarySales(data) {
    if (!Array.isArray(data)) return 0
    return data.reduce((sum, sale) => sum + (sale.unitsSold || sale.units_sold || 0), 0)
  }

  const totalAlerts = calculateSummaryAlerts(alerts)
  const totalSales = calculateSummarySales(sales)

  return (
    <main className='dashboard-main'>
      <div className='dashboard-head'>
        <h1>Inventory Overview</h1>
        <h2>Hello <span>{user?.fullname || 'User'}</span>👋. Welcome back!!</h2>
      </div>
      
      <DashForecast 
        TotalStock={TotalStock} 
        totalDemand={totalDemand} 
        totalSales={totalSales} 
        totalAlerts={totalAlerts}
      />

      <section className='dashboard-chart'>
        <h3>Stocks Chart</h3>
        <Barchart products={products}/>
      </section>

      <section>
        <h3>Inventory Table</h3>
        <Selector nonDuplicateCategory={nonDuplicateCategory} onFilter={setFilter}/>
        <DashBoardInventory filteredProducts={filteredProducts}/>
      </section>
    </main>
  )
}

export default Dashboard