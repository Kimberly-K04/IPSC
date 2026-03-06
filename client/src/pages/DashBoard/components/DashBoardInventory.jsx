import React from 'react'
import TableRender from './TableRender'

function DashBoardInventory({filteredProducts}) {
    function createData(name, sku, stock, demandForecast, alerts) {
        return { name, sku, stock, demandForecast, alerts };
    }

    const rows = filteredProducts.map(pro=>
        createData(pro.name, pro.sku, pro.stock, pro.demand_forecast, pro.alerts)
    )
  return (
    <>
        <section className='dashboard-inventory-table'>
            <div>
                <TableRender rows={rows}/>
            </div>
        </section>
    </>
  )
}

export default DashBoardInventory