import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './css/LoadingCircle.css'

export default function LoadingCircle() {
  return (
    <div className='saving-user-details'>
      <p>Saving...</p>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress color='secondary' />
      </Box>
    </div>
  );
}
