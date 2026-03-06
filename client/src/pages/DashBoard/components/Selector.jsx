import React from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';

function Selector({nonDuplicateCategory, onFilter}) {
    const [category, setCategory] = useState("")
    function handleChange(e){
        const {value} = e.target
        setCategory(value)
        onFilter(value)
    }

    const renderCategories = nonDuplicateCategory.map(cat=>{
        return(
            <MenuItem key={cat.id} value={cat}>{cat}</MenuItem>
        )
    })

    const selectorBoxStyles = {
        color:'var(--color)',
        backgroungColor:'var(--navBg)'
    }
  return (
    <>
        <Box sx={{minWidth: 200}}>
            <FormControl variant="standard" sx={{m: 1, minWidth: 250}} size="small">
                <InputLabel id="demo-simple-select-label" sx={{color:"var(--color)"}} >Categories</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={category}
                    label="category"
                    sx={selectorBoxStyles}
                    onChange={handleChange}
                >
                    <MenuItem value="">None</MenuItem>
                    {renderCategories}
                </Select>
            </FormControl>
    </Box>

    </>
  )
}

export default Selector