import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './css/Table.css'

function TableRender({rows = []}) {
    const mainTableBody = {
        '&:last-child td, &:last-child th': { border: 0 },
        backgroundColor: "var(--mainBg)"
    }
    const headerStyles = {
        letterSpacing: '2px',
        fontSize: '1.2rem',
        fontWeight: 650,
        backgroundColor: 'var(--tabsBg)',
        color: 'var(--color)'
    }

    const renderRows = (rows || []).map((row, index) => {
        const activeAlerts = Array.isArray(row.alerts) ? row.alerts : [];
        
        const alertsStyle = {
            backgroundColor: activeAlerts.length > 0 ? 'var(--error)' : 'var(--success)',
            borderRadius: '15px',
            color: "var(--color)",
            fontWeight: 'bold',
            textAlign: 'center'
        }
        
        const dataStyle = { color: "var(--color)" }

        return (
            <TableRow key={row.id || index} sx={mainTableBody}>
                <TableCell sx={dataStyle} className='tbl-name'>{row.name || "N/A"}</TableCell>
                <TableCell sx={dataStyle} align="center">{row.sku || "N/A"}</TableCell>
                <TableCell sx={dataStyle} align="center">{row.stock ?? 0}</TableCell>
                <TableCell sx={dataStyle} align="center">{row.demandForecast ?? 0}%</TableCell>
                <TableCell align="center">
                    <div style={alertsStyle}>
                        {activeAlerts.length > 0 ? "Low Stock" : "Healthy"}
                    </div>
                </TableCell>
            </TableRow>
        )
    })

    return (
        <section className='dash-table'>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650 }} aria-label="inventory table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerStyles}>Product Name</TableCell>
                            <TableCell sx={headerStyles} align="center">SKU</TableCell>
                            <TableCell sx={headerStyles} align="center">Stock</TableCell>
                            <TableCell sx={headerStyles} align="center">Forecast</TableCell>
                            <TableCell sx={headerStyles} align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows && rows.length > 0 ? renderRows : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" style={{ color: 'var(--color)', padding: '2rem' }}>
                                    No Inventory Data Found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </section>
    )
}

export default TableRender