import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('Sales_deals') 
        .select('*')

      if (error) {
        console.error('Supabase error:', error)
        setError(error.message) 
      } else {
        setData(data)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>Supabase + React + Vite</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App