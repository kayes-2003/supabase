import { useState, useEffect } from 'react'
import supabase from './supabase-client'
import Dashboard from './components/Dashboard';
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('Sales_deals') 
        .select('*')

      if (error) {
        setError(error.message)
      } else {
        setData(data)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Supabase + React + Vite ✅</h1>
      <Dashboard />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  )
}

export default App