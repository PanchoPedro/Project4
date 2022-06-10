import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { ToastContainer, Toast, Container, Form, FormControl, Button, Row, Col } from 'react-bootstrap';

export default function Register() {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState( {
        style: "",
        title: "",
        message: ""
    });
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser)
            navigate("/");
    }, []);
    
    function showToastMessage(toastmessage) {
        setToastMessage(toastmessage);
        setShowToast(true);
    }
    
    const registerUser = (e) => {
        e.preventDefault();
        
        if(e.target.password.value === e.target.rpassword.value) {            
            fetch("http://localhost:3003/users?username=" + e.target.username.value)
                .then((response) => response.json())
                .then((json) => {
                    let userData = json.find(user => user.username === e.target.username.value);
                    if (!userData) {            
                        fetch("http://localhost:3003/users?email=" + e.target.email.value)
                            .then((response) => response.json())
                            .then((json) => {
                                let userData = json.find(user => user.email === e.target.email.value);
                                if (!userData) {
                                    var role = "customer";
                                    let newUser = {
                                        username: e.target.username.value,
                                        email: e.target.email.value,
                                        password: e.target.password.value,
                                        role: role
                                    };
                                    fetch("http://localhost:3003/users/", {
                                        method: "POST",
                                        headers : { 
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(newUser)
                                    })
                                        .then((response) => response.json())
                                        .then((json) => {
                                            if (json) {
                                                let loggedInUser = {
                                                    id: json.id,
                                                    username: json.username,
                                                    email: json.email,
                                                    role: json.role
                                                };
                                                localStorage.setItem("user", JSON.stringify(loggedInUser));
                                                navigate("/");
                                                window.location.reload(false);
                                            } else {
                                                console.log("Error: Registration failed");
                                                showToastMessage({ style: "danger", message: "Registration failed" });
                                            }
                                        }).catch(console.log);
                                } else {
                                    console.log("Error: Email exists");
                                    showToastMessage({ style: "warning", message: "Email exists" });
                                }
                            }).catch(console.log);
                    } else {
                        console.log("Error: User exists");
                        showToastMessage({ style: "warning", message: "Username exists" });
                    }
                }).catch(console.log);
            
        }
        else{
            console.log("Error: Passwords don't match");
            showToastMessage({ style: "danger", message: "Passwords don't match" });
        }
    }
    
    return (
        <Row>
            <Col sm="3" />
            <Col>
                <div className="jumbotron">
                    <h1 class="display-5">Customer Registration</h1>
                    <br />
                    <Form onSubmit={registerUser}>
                        <Container className="w-75">
                            <Row className="mb-3">
                                <Col class="md-6">
                                    <Form.Label htmlFor="username">Username</Form.Label>
                                    <FormControl type="text" id="username" name="username" placeholder="Username" required />
                                </Col>
                                <Col class="md-6">
                                    <Form.Label htmlFor="email">Email</Form.Label>
                                    <FormControl type="text" id="email" name="email" placeholder="Email address" required />
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col class="col-md-6">
                                    <Form.Label htmlFor="password">Password</Form.Label>
                                    <FormControl type="password" id="password" name="password" placeholder="Enter password" required />
                                </Col>
                                <Col class="col-md-6">
                                    <Form.Label htmlFor="rpassword">Repeat Password</Form.Label>
                                    <FormControl type="password" id="rpassword" name="rpassword" placeholder="Repeat Password" required />
                                </Col>
                            </Row>

                        </Container>
                        <Button type="submit" variant="primary" className="w-25 mt-4">Complete registration</Button>
                    </Form>
                </div>
            </Col>
            <Col sm="3">
                <ToastContainer className="mt-5 pt-3 me-2" position="top-end">
                    <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} bg={toastMessage.style} autohide>
                        {
                            toastMessage.title &&
                            <Toast.Header>
                                <strong className="me-auto">{toastMessage.title}</strong>
                            </Toast.Header>
                        }
                        <Toast.Body>{toastMessage.message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Col>
        </Row>
    )
}