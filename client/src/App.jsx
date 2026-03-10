import './App.css'
import NavBar from './components/NavBar'
import { Outlet} from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import {useState, useEffect} from 'react'
import SkeletomComp from './components/SkeletomComp'
import FetchError from './components/FetchError'
import Login from './pages/Login/Login'

function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)


  useEffect(()=>{
    async function autoLogin(){
      try{
        const r = await fetch('/check_session')
        
        if (!r.ok){
        throw new Error('Not Authenticated')}
        
        const user= await r.json()
        setUser(user)

        const resProducts=await fetch('/products')
        const productData= await resProducts.json()
        setProducts(productData)
        setLoading(false)
      }catch((err)=>{
        console.log(err)
        setLoading(false)
      })
    }
  },[])


  // useEffect(()=>{

  //   async function handlefetch(url, setterFunc){
  //     try{
  //       const r  = await fetch(`${APIBaseurl}/${url}`)

  //       if(!r.ok){
  //         throw new Error(`Error status: ${r.status}`)
  //       }
  //       const data = await r.json()
  //       // console.log(`Data received: ${url}`, data)
  //       setterFunc(data)
  //     }catch(error){
  //       // console.error(error)
  //       setError(error.message)
  //     }
  //   }

    // when all promise are resolved
  //   Promise.all([
  //     handlefetch('users', setUsers),
  //     handlefetch('products', setProducts)
  //   ])
  //     .then(()=>{setLoading(true)})
  //     .catch(()=>{setLoading(true)}) // show page even when it has error

  // }, [APIBaseurl])

  // console.table(users)
  // console.table(products)


  async function handleProfileEdit(e, formObj){
    e.preventDefault()
    setSending(prev=>!prev)
    const configObj={
      method:'PATCH',
      headers:{
        "Content-Type":'application/json'
      },
      body:JSON.stringify(formObj)
    }
    try{
      const r = await fetch(`${APIBaseurl}/users/${encodeURIComponent(formObj.id)}`, configObj)
      if(!r.ok){
          throw new Error(`Error status: ${r.status}`)
        }
      const updatedUserDta = await r.json()
      setUsers(prev=>prev.map(user=>user.id===updatedUserDta.id?updatedUserDta:user))
      setSending(prev=>!prev)
      console.log("Success", updatedUserDta)
    }catch(error){
      console.log(error)
      setError(error.message)
    }
  }

  if(!user) return <Login onLogin={setUser}/>

  return (
    <>
    {loading
    ?<main>
      <Header users={users}/>
      <section className='main-wrapper'>
        <aside><NavBar/></aside>
        { error
          ?<FetchError error={error}/>
          :<Outlet context={{
            users:users, 
            products:products, 
            onProfileEdit:handleProfileEdit,
            sending:sending
          }}/>
        }
      </section>
    </main>
    :<SkeletomComp/>}
    </>
  )
}

export default App
