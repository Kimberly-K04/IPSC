import './App.css'
import NavBar from './components/NavBar'
import { Outlet, useNavigate} from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import {useState, useEffect, useCallback} from 'react'
import SkeletomComp from './components/SkeletomComp'
import FetchError from './components/FetchError'

function App() {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [orders, setOrders] = useState([])
  const [sales, setSales] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)

  const api= import.meta.env.VITE_API_BASE

  const loadData=useCallback (async  ()=>{
      setLoading(true)
      try {
        const checkSessionRes = await fetch(`${api}/check_session`)
        if (!checkSessionRes.ok) throw new Error('Not Authenticated')
        
        const userData = await checkSessionRes.json()
        setUser(userData)

        // Promise.allSettled allows some fetches to fail without killing the whole app
        const results = await Promise.allSettled([
          fetch(`${api}/products`),
          fetch(`${api}/suppliers`),
          fetch(`${api}/users/me/orders`),
          fetch(`${api}/users/me/sales`),
          fetch(`${api}/alerts`)
        ])

        const extract = async (result) => {
          if (result.status === 'fulfilled' && result.value.ok) {
            const json = await result.value.json()
            // CRITICAL: Unwrapping the 'data' key from the backend response
            return json.data || (Array.isArray(json) ? json : [])
          }
          // Log failed fetches for debugging
          if (result.status === 'fulfilled' && !result.value.ok) {
             console.error('Fetch failed:', result.value.url)
          }
          return []
        }

        // Map all results to their respective states using the cleaner array destructuring
        const [p, sup, ord, sal, alt] = await Promise.all(results.map(extract))

        setProducts(p)
        setSuppliers(sup)
        setOrders(ord)
        setSales(sal)
        setAlerts(alt)

      } catch (err) {
        if (err.message === 'Not Authenticated') {
          setUser(null)
          navigate('/login') // Keep the team's navigate logic
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }, [navigate])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Profile and Logout logic
  async function handleProfileEdit(e, formObj){
    e.preventDefault()
    setSending(true)
    const configObj={
      method:'PATCH',
      headers:{"Content-Type":'application/json'},
      body:JSON.stringify(formObj)
    }
    try{
      const r = await fetch(`${api}/users/${encodeURIComponent(formObj.id)}`, configObj)
      if(!r.ok) throw new Error(`Error status: ${r.status}`)
      const resData = await r.json()
      // Use the .data wrapper if the backend provides it, otherwise use the object
      setUser(resData.data || resData)
    }catch(error){
      setError(error.message)
    }finally{
      setSending(false)
    }
  }

  async function handleLogOut(){
    const configObj={method:'DELETE', headers:{'Content-Type':'application/json'}}
    try{
      const r = await fetch(`${api}/logout`, configObj)
      if (!r.ok) throw new Error('Failed to LogOut')
      setUser(null)
      navigate('/login')
    }catch(err){
      setError(err.message)
    }
  }

  if (loading) return <SkeletomComp/>

  const addProduct = (newProduct) => {
  setProducts(prev => [newProduct, ...prev]);
};

const addOrderAndSale = (newOrder, newSale) => {
  setOrders(prev => [newOrder, ...prev]);
  setSales(prev => [newSale, ...prev]);
};
  
  // Return the main UI
  return (
    <main>
      <Header user={user}/>
      <section className='main-wrapper'>
        <aside><NavBar/></aside>
        {error ? <FetchError error={error}/> : 
          <Outlet context={{
            user, products, sales, orders, suppliers, alerts,
            onProfileEdit: handleProfileEdit,
            onLogOut: handleLogOut,
            refreshData:loadData,
            addProduct,addOrderAndSale,
            sending
          }}/>
        }
      </section>
    </main>
  )
}

export default App