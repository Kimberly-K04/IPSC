import React from 'react'
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, Legend, XAxis, YAxis, Tooltip } from 'recharts'

function Barchart({ products }) {
  // 1. DEFENSIVE CHECK: Ensure products is an array before calling .reduce
  // We handle both direct arrays and the wrapped {data: []} format
  const safeProducts = Array.isArray(products) 
    ? products 
    : (products?.data || []);

  // 2. Group products safely
  const categoryData = safeProducts.reduce((acc, product) => {
    // Safety check for product existence
    if (!product) return acc;

    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { 
        category: category, 
        totalStock: 0,
        productCount: 0
      };
    }
    
    // Check both naming conventions for stock
    const stockVal = product.stock ?? product.stock_quantity ?? 0;
    
    acc[category].totalStock += Number(stockVal);
    acc[category].productCount += 1;
    return acc;
  }, {});

  const chartData = Object.values(categoryData);

  const CustomToolTipBar = ({active, payload, label}) => {
    const styleTip = {
        backgroundColor: 'var(--cardBg)',
        color: 'var(--color)',
        padding: '15px',
        border: '1px solid var(--hover)',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
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

  // 3. RENDER CHECK: If no data, show a friendly message instead of a blank chart
  if (chartData.length === 0) {
    return (
      <div style={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color)' }}>
        <p>No inventory data available for chart.</p>
      </div>
    );
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
          stroke="var(--color)"
        />
        <YAxis stroke="var(--color)" />
        <Tooltip content={<CustomToolTipBar />}/>
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