import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './css/Table.css'
function TableRender({rows}) {
    const mainTableBody={
        '&:last-child td, &:last-child th': { border: 0 },
        backgroundColor:"var(--mainBg)"
    }
    const headerStyles={
        letterSpacing:'2px',
        fontSize:'1.5rem',
        fontWeight:650,
        backgroundColor:'var(--tabsBg)',
        color:'var(--color)'
    }

    const renderRows=rows.map((row) =>{

        const alertsStyle={
            backgroundColor:row.alerts && row.alerts.length > 0 ? 'var(--error)' : 'var(--success)',
            borderRadius:'15px',
            color:"var(--color)",
            fontWeight:'bold'
        }
        const dataStyle={
            color:"var(--color)"
        }
        return(
            <TableRow
                key={row.id}
                sx={mainTableBody}
                >
                <TableCell sx={dataStyle} className='tbl-name' component="th" scope="row">{row.name}</TableCell>
                <TableCell sx={dataStyle} align="center">{row.sku}</TableCell>
                <TableCell sx={dataStyle} align="center">{row.stock}</TableCell>
                <TableCell sx={dataStyle} align="center">{row.demandForecast}</TableCell>
                <TableCell align="center" sx={alertsStyle}
                >{row.alerts&&row.alerts.length>0?"Low Stock":"Green"}</TableCell>
            </TableRow>
    )})
    return (
    <section className='dash-table'>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell sx={headerStyles}>Product Name</TableCell>
                    <TableCell sx={headerStyles} align="center">SKU</TableCell>
                    <TableCell sx={headerStyles} align="center">Stock</TableCell>
                    <TableCell sx={headerStyles} align="center">Demand Forecast(%)</TableCell>
                    <TableCell sx={headerStyles} align="center">Risk Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {renderRows}
                </TableBody>
            </Table>
        </TableContainer>
    </section>
  )
}

export default TableRender