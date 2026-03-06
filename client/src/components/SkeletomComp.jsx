import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import './css/Skeleton.css'

function SkeletomComp() {
  return (
    <>
    <Skeleton variant="rectangular" width="100%" height={100} />
    <main className='main-skeleton'>
        <div className='nav-skeleton'>
            <Skeleton variant="rectangular" width={210} height="100%" />
        </div>
        <Stack spacing={2}>
            {/* For variant="text", adjust the height via font-size */}
            <Skeleton variant="text" sx={{ fontSize: '2rem', width:500 }} />
            <Skeleton variant="text" sx={{ fontSize: '3rem', textAlign:'center', width:500 }} />
            {/* For other variants, adjust the size with `width` and `height` */}
            <div>
                <Skeleton variant="text" sx={{ fontSize: '2rem', width:500 }} />
                <div className='dashboard-forecast-cards'>
                    <Skeleton variant="rectangular" width={210} height={200} />
                    <Skeleton variant="rectangular" width={210} height={200} />
                    <Skeleton variant="rectangular" width={210} height={200} />
                    <Skeleton variant="rectangular" width={210} height={200} />
                </div>
            </div>
            <div>
                <Skeleton variant="text" sx={{ fontSize: '2rem', width:500 }} />
                <Skeleton variant="rectangular" width={210} height={200} />
            </div>
            <div>
                <Skeleton variant="text" sx={{ fontSize: '2rem', width:500 }} />
                <Skeleton variant="rectangular" width={710} height={300} />
            </div>
        </Stack>
    </main>
    </>
  )
}

export default SkeletomComp