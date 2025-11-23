import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CodeStats from './pages/CodeStats'


export default function App(){
return (
<div style={{padding:20,fontFamily:'Arial'}}>
<header style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
<h1><Link to="/">TinyLink</Link></h1>
</header>
<Routes>
<Route path="/" element={<Dashboard/>} />
<Route path="/code/:code" element={<CodeStats/>} />
</Routes>
</div>
)
}