import React from 'react'
import { BrowserRouter , Routes , Route  } from 'react-router-dom';
import './App.css';

import Todo from './pages/Todo';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  console.log(import.meta.env.VITE_APP_API_KEY);
  return (
    <div>
      <BrowserRouter> // can also import as router ( hierarchy - router, routes , route )
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
