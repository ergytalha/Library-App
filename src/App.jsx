import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import Header from './components/Header'
import Home from "./pages/home/Home";
import Books from "./pages/books/Books";
import Authors from "./pages/authors/Authors";
import Publishers from "./pages/publishers/Publishers";
import Categories from "./pages/categories/Categories";
import Borrowing from "./pages/borrowing/Borrowing";
function App() {
  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/books" element={<Books/>}/>
        <Route path="/authors" element={<Authors/>}/>
        <Route path="/publishers" element={<Publishers/>}/>
        <Route path="/categories" element={<Categories/>}/>
        <Route path="/borrowing" element={<Borrowing/>}/>
      </Routes>
      </Router>
    </>
  )
}

export default App
