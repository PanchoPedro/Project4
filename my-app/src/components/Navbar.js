import React, { useState, useEffect } from 'react'
import { Toast, Navbar, Nav, Modal, Badge, Form, FormControl, Button, Col } from 'react-bootstrap';
import { PersonCircle, Cart4, PersonFill } from 'react-bootstrap-icons';
import AdminConsole from './Passwordchange';



const BSNavbar = () => {
    const [user, setUser] = useState({})
    const [cart, setCart] = useState({
        totalPrice: 0,
        itemsCount: 0,
        items: []
    });
    const [showAdminConsole, setShowAdminConsole] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState( {
        style: "",
        title: "",
        message: ""
    });

    //const handleCloseAdminConsole = () => setShowAdminConsole(false);
    //const handleShowAdminConsole = () => setShowAdminConsole(true);

    const errors = {
        uname: "invalid username",
        pass: "invalid password"
    };
    
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser)
            setUser(JSON.parse(loggedInUser));
        
        const currentCart = localStorage.getItem("cart");
        if(currentCart)
            setCart(JSON.parse(currentCart));
    }, []);
    
    function showToastMessage(toastmessage) {
        setToastMessage(toastmessage);
        setShowToast(true);
    }



    const handleLogout = () => {
        setUser("");
        localStorage.setItem("user", "");
        window.location.reload();
    }
    
    const handleLogin = (e) => {
        //Prevent page reload
        e.preventDefault();

        const loginData = { username: e.target.username.value, password: e.target.password.value };
        
        fetch("http://localhost:3003/users?username=" + loginData.username)
            .then((response) => response.json())
            .then((json) => {
                let userData = json.find(user => user.username === loginData.username);
            
                if (userData) {
                    if (userData.password !== loginData.password) {
                        // Invalid password
                        console.log("Error: " + errors.pass);
                        showToastMessage({ style: "base", message: "Invalid credentials" });
                    } else {
                        let loggedInUser = {
                            id: userData.id,
                            username: userData.username,
                            email: userData.email,
                            role: userData.role
                        };
                        setUser(loggedInUser);
                        localStorage.setItem("user", JSON.stringify(loggedInUser));
                        window.location.reload(false);
                    }
                } else {
                    console.log("Error: " + errors.uname);
                    showToastMessage({ style: "danger", message: "Invalid credentials" });
                }
            }).catch(console.log);
    };
    
    return(
        <>
            <Navbar collapseOnSelect className="px-2" bg="light" variant="light" expand="sm" fixed="top">
                <Navbar.Brand href="/">Home</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link href="/products">Groceries</Nav.Link>
                    </Nav>
                    <Col className="d-flex align-items-center justify-content-center">
                        <Toast className onClose={() => setShowToast(false)} show={showToast} delay={5000} bg={toastMessage.style} autohide>
                            {
                                toastMessage.title &&
                                <Toast.Header>
                                    <strong className="me-auto">{toastMessage.title}</strong>
                                </Toast.Header>
                            }
                            <Toast.Body>{toastMessage.message}</Toast.Body>
                        </Toast>
                    </Col>

                    {
                        user && user.username &&
                        <Nav>
                            <Nav.Item className="text-black d-flex align-items-center">
                                <PersonFill width="32" height="32" fill="black" />
                                <span class="ms-2 me-3">{user.username}</span>
                            </Nav.Item>
                            {
                                user.role === "admin" &&
                                
                                <Nav.Item className="me-2">						
                                    <a href="itemsMasterlist" class="f-n-hover btn btn-primary btn-md mx-2">Product Management</a>
                                    <a href="usersMasterlist" class="f-n-hover btn btn-primary btn-md mx-2">User Management</a>
                                    <a href="adminconsole" class="f-n-hover btn btn-primary btn-md mx-2">Password Management</a>
            
                                </Nav.Item>
                           
                            }
                            <Nav.Item>
                                <Button variant="outline-secondary me-2" onClick={handleLogout}>Logout</Button>
                            </Nav.Item>
                        </Nav>
                    }
                    {
                        (!user || !user.username) &&
                        <Nav>
                            <Form className="d-flex" onSubmit={handleLogin}>
                                <FormControl type="text" name="username" placeholder="Username" required />
                                <FormControl className="mx-2" type="password" name="password" placeholder="Password" required />
                                <Button type="submit" class="fadeIn fourth">Login</Button>
                            </Form>
                            <a class="btn btn-outline-primary" href="/register">Register</a>
                        </Nav>
                    }
                    <a class="ms-1" href="/cart">
                        <Cart4 width="32" height="32" fill="black" />
                        <Badge bg="warning">{cart.itemsCount}</Badge>
                        <span className="visually-hidden">items in the cart</span>
                    </a>
                </Navbar.Collapse>
            </Navbar>
            
        </>
    );  
}

export default BSNavbar;