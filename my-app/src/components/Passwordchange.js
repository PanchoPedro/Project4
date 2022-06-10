import React, { useState, useEffect } from 'react'
import { Button, Alert, Form, FormControl, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function PasswordChange() {
    const [alertMessage, setAlertMessage] = useState({});
    
    const navigate = useNavigate();
    
    useEffect(() => {
        var loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            loggedInUser = JSON.parse(loggedInUser);
            if(loggedInUser.role !== "admin")
                navigate("/");
        }
        else
            navigate("/");
    });

    const renderAlertMessage = () => (
        <div>
            <Alert variant={alertMessage.style} className="py-0">{alertMessage.message}</Alert>
        </div>
    );
    
    const submitPasswordChange = (event) => {
        event.preventDefault();
        if(event.target.password.value === event.target.rpassword.value) {
            let loggedInUser = JSON.parse(localStorage.getItem("user"));
            loggedInUser["password"] = event.target.password.value;

            fetch("http://localhost:3003/users/" + loggedInUser.id, {
                method: "PUT",
                headers : { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loggedInUser)
            })
                .catch(console.log);
            setAlertMessage({ style: "success", message: "Password changed" });
        }
        else
            setAlertMessage({ style: "danger", message: "The passwords must match" });
    }
    
    return (
        <>
            <Row className="mx-auto text-center">
                <Form onSubmit={submitPasswordChange}>
                    <p>
                        <label><strong>Change your password</strong></label>
                    </p>
                    <Row className="mb-3">
                        <Col>
                            <FormControl type="password" name="password" placeholder="New Password" required />
                        </Col>
                        <Col>
                            <FormControl type="password" name="rpassword" placeholder="Repeat new Password" required />
                        </Col>
                    </Row>
                    <p>{alertMessage.message && renderAlertMessage()}</p>
                    <Button variant='primary' type='submit'>Change password</Button>
                </Form>
            </Row>
        </>
    );
}