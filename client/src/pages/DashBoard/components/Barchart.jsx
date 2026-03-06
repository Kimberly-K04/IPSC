import React from 'react'
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, Legend, XAxis, YAxis, Tooltip } from 'recharts'

function Barchart({products}) {
  // Group products by category and accumulate stock
  const categoryData = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { 
        category: category, 
        totalStock: 0,
        productCount: 0
      };
    }
    acc[category].totalStock += product.stock || 0;
    acc[category].productCount += 1;
    return acc;
  }, {});

  // Convert to array for Recharts
  const chartData = Object.values(categoryData);

  const CustomToolTipBar = ({active, payload, label})=>{
    const styleTip = {
        backgroundColor: 'var(--cardBg)',
        color: 'var(--color)',
        padding: '15px',
        border: '1px solid var(--hover)',
        borderRadius: '10px',
        boxShadow: '0 4px 12px var(--color)',
        fontSize: '1.09rem',
        fontWeight: '550'
    }
    if(active && payload && payload.length){
        return(
            <div style={styleTip}>
                <p style={{fontWeight:"600"}}>{`Category: ${label}`}</p>
                <p style={{color:"var(--hover)"}}>{`Total Stock: ${payload[0].value}`}</p>
            </div>
        )
    }
    return null
  }

  return (
    <ResponsiveContainer height={600} width='100%'>
      <BarChart 
        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}  
        data={chartData}
      >
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis 
          dataKey="category" 
          angle={0}
          textAnchor="middle"
          height={60}
        />
        <YAxis />
        <Tooltip content={CustomToolTipBar}/>
        <Legend />
        <Bar 
          fill='var(--hover)' 
          stroke='var(--color)'
          dataKey="totalStock"
          name="Total Stock"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Barchart