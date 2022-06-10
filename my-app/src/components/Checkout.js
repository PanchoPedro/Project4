import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Stack, Form, FormControl, Button, Row, Col, Badge } from 'react-bootstrap';

export default function Checkout() {
    const [user, setUser] = useState("");
    const [cart, setCart] = useState({});
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const currentCart = localStorage.getItem("cart");
        if(currentCart)
            setCart(JSON.parse(currentCart));
        
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser)
            setUser(JSON.parse(loggedInUser));
        else
            navigate("/");
    }, []);
    
    const clearCart = () => {
        setCart({
            totalPrice: 0,
            itemsCount: 0,
            items: []
        })
        localStorage.setItem("cart", "");
    }
    
    const clickHandler = (e) => {
        console.log("clickHandler");
        e.stopPropagation();

        if (e.ctrlKey) {
            processPayment(e);
        }
    }
    
    const processPayment = (e) => {
                clearCart();
                navigate("/completion");
                window.location.reload(false);
    }
    

    
    return (
        <Row>
            <Col sm="3" />
            <Col>
                <div className="jumbotron">
                    <h1 class="display-5">Checkout</h1>
                    <p class="fs-4 fw-light mb-3">
                    Please enter Payment details
                    </p>
                    <br />
                    <Form onSubmit={processPayment} className="needs-validation">
                        <Row>
                            <Col className="order-md-2 mb-4">

                                <h4 class="d-flex justify-content-between align-items-center mt-2">
                                    <span class="text-muted">Total</span>
                                    <Badge pill bg="primary" id="total">{(Math.round(cart.totalPrice * 100) / 100).toFixed(2)} €</Badge>
                                </h4>
                            </Col>
                            <Col md="8" className="order-md-1">
                                <Form.Check id="credit" name="payment_method" type="radio" label="Credit card" className="my-3 col-sm-3" defaultChecked required />
                                <div class="card-details">
                                    <h3 class="title">Credit Card Details</h3>
                                    <Row>
                                        <Col sm="8">
                                            <label htmlFor="cc-name">Name on card</label>
                                            <FormControl id="cc-name" name="cc-name" type="text" placeholder="Card Holder" required />
                                        </Col>
                                        <Col sm="4">
                                            <label htmlFor="cc-expiration">Expiration Date</label>
                                            <FormControl type="month" id="cc-expiration" name="cc-expiration" placeholder="MM" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="8">
                                            <label htmlFor="cc_number">Card Number</label>
                                            <FormControl id="cc_number" name="cc_number" type="text" placeholder="Card Number" 
                                                min="000000000000000" max="999999999999999" step="1"  required />
                                        </Col>
                                        <Col sm="4">
                                            <label htmlFor="cc-cvv">CVV</label>
                                            <FormControl id="cc-cvv" name="cc-cvv" type="text" placeholder="CVC" minLength="3" maxLength="3"
                                                min="000" max="999" step="1" pattern="[0-9]{3}" required />
                                        </Col>
                                    </Row>
                                </div>
                                <hr class="mb-4" />
                                <Row>
                                    <Col>
                                        <Button variant="primary" type="submit" onClick={clickHandler}>Confirm payment</Button>
                                    </Col>
                                    <Col />
                                    <Col>
                                        <a href="/cart" class="f-n-hover btn btn-danger btn-md w-75">Cancel</a>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Col>
            <Col sm="3" />
        </Row>
    );
}