import './App.css'
import Layout from './component/Layout'
import Dashboard  from './pages/Dashboard'
import Details from './pages/Details'
import { BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/details" element={<Details />} />
          {/* Optional dynamic route for specific item details */}
          <Route path="/details/:id" element={<Details />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
