import React from 'react'
import './App.css';
import './components/jumbotron.css';


import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CartDetails from './components/CartDetails';
import Items from './components/Items';
import Checkout from './components/Checkout';
import Completion from './components/Completion';
import Register from './components/Register';
import AdminConsole from './components/Passwordchange';
import ItemsMasterlist from './components/ItemsMasterlist';
import UsersMasterlist from './components/UsersMasterlist';
    


function App() {
    
    return (
        <div className="App">
            <header>
                <Navbar/>
            </header>
            <body>
                <div className="my-5 pt-5">
                    <Routes>
                        <Route path='/' element={<Home/>}></Route>
                        <Route path='/cart' element={<CartDetails/>}></Route>
                        <Route path='/products' element={<Items/>}></Route>
                        <Route path='/checkout' element={<Checkout/>}></Route>
                        <Route path='/completion' element={<Completion/>}></Route>
                        <Route path='/register' element={<Register/>}></Route>
                        <Route path='/itemsMasterlist' element={<ItemsMasterlist/>}></Route>
                        <Route path='/usersMasterlist' element={<UsersMasterlist/>}></Route>
                        <Route path='/adminconsole' element={<AdminConsole/>}></Route>
                    </Routes>
                </div>
            </body>

        </div>
    );
}

export default App;
