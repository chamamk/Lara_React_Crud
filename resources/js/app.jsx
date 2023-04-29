import './bootstrap';
import '../css/app.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import ReactDOM from 'react-dom/client';
import Home from './components/Home';
// import About from './components/About';
import Edit from './components/tasks/Edit';
import Create from './components/tasks/Create';
import { Fragment } from 'react';
import Navbar from './components/Navbar';
import Task from './components/tasks/Task';

ReactDOM.createRoot(document.getElementById('app')).render(
    <BrowserRouter>
    <Navbar />
    <Routes>
        <Route path='/' element={<Home />}/>
        {/* <Route path='/' element={ <About />}/> */}
        <Route path='/create' element={<Create />}/>
        <Route path='/edit/:taskId' element={<Edit />}/>
        <Route path='/task' element={<Task />}/>
    </Routes>
    </BrowserRouter>

);
