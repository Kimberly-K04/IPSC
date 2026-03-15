import React from 'react'
import TableRender from './TableRender'

function DashBoardInventory({ filteredProducts }) {
    // 1. Defensively handle if filteredProducts is the whole object or just the array
    const productArray = Array.isArray(filteredProducts) 
        ? filteredProducts 
        : (filteredProducts?.data || []);

    // 2. Map the data safely
    const rows = productArray.map((pro, index) => {
        return {
            id: pro.id || index,
            name: pro.name || "Unnamed Product",
            sku: pro.sku || `SKU-${pro.id || index}`,
            // Check both naming conventions for stock
            stock: pro.stock ?? pro.stock_quantity ?? 0,
            // Fallback for demand forecast
            demandForecast: pro.demandForecast ?? pro.demand_forecast ?? 0,
            alerts: Array.isArray(pro.alerts) ? pro.alerts : []
        };
    });

    return (
        <section className='dashboard-inventory-table'>
            <div>
                {/* We pass the sanitized rows to TableRender */}
                <TableRender rows={rows}/>
            </div>
        </section>
    )
}

export default DashBoardInventory