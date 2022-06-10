import React, { useState, useEffect } from 'react'
import { ToastContainer, Toast, Stack, Modal, FormControl, Button, Row, Col } from 'react-bootstrap';
import { CartXFill } from 'react-bootstrap-icons';

export default function CartDetails() {
    const [user, setUser] = useState("")
    const [cart, setCart] = useState({
        totalPrice: 0,
        itemsCount: 0,
        items: []
    });
    const [selectedItem, setSelectedItem] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState( {
        style: "",
        title: "",
        message: ""
    });
    
    useEffect(() => {
        const currentCart = localStorage.getItem("cart");
        if(currentCart)
            setCart(JSON.parse(currentCart));
        
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser)
            setUser(JSON.parse(loggedInUser));
    }, []);
    
    function showToastMessage(toastmessage) {
        setToastMessage(toastmessage);
        setShowToast(true);
    }

    const handleCloseConfirmModal = () => {
        setSelectedItem(""); 
        setShowConfirmModal(false);
    };
    
    const handleShowConfirmModal = (e) => {
        var id = "";
        switch (e.target.localName) {
            case "path":
                id = e.target.parentNode.parentNode.id;
                break;
            case "svg":
                id = e.target.parentNode.id;
                break;
            default:
                id = e.target.id;
        }
        
        if(id !== "clearCart")
            setSelectedItem(cart.items.find(item => item.item.id === parseInt(id))); 
        
        setShowConfirmModal(true);
    };
    
    const removeFromCart = (e) => {
        e.preventDefault();
        if(selectedItem) {
            let itemToRemove = cart.items.find(cartItem => cartItem.item.id === selectedItem.item.id);

            handleCloseConfirmModal();

            cart.totalPrice = cart.totalPrice - itemToRemove.total;
            cart.itemsCount = cart.itemsCount - itemToRemove.quantity;

            if(cart.itemsCount === 0)
                clearCart(e);
            else {
                let index = cart.items.indexOf(itemToRemove);
                console.log(index);
                if (index !== -1) {
                    cart.items.splice(index, 1);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    window.location.reload(false);
                }
            }
        }
        else
            showToastMessage({ style: "danger", message: "An error occurred." });
    }
    
    const clearCart = (e) => {
        e.preventDefault();
        handleCloseConfirmModal();
        
        setCart({
            totalPrice: 0,
            itemsCount: 0,
            items: []
        })
        localStorage.setItem("cart", "");
        window.location.reload(false);
        showToastMessage({ style: "success", message: "Cart cleared" });
    }
    
    const changeQuantity = (e) => {
        let index = cart.items.findIndex(cartItem => cartItem.item.id === parseInt(e.target.id));
        if (index !== -1) {
            let oldQty = cart.items[index].quantity;
            let oldTotal = cart.items[index].total;
            cart.items[index].quantity = parseInt(e.target.value);
            cart.items[index].total = cart.items[index].item.price * cart.items[index].quantity;
            cart.itemsCount = cart.itemsCount - oldQty + cart.items[index].quantity;
            cart.totalPrice = cart.totalPrice - oldTotal + cart.items[index].total;
            localStorage.setItem("cart", JSON.stringify(cart));
            window.location.reload(false);
        }
        else
            showToastMessage({ style: "danger", message: "An error occurred." });
    }
    
    const renderItemsList = () => {
        try {
            return cart.items.map((cartItem) =>
                <div class="d-style bg-light py-3 shadow-sm">
                    <Row className="align-items-center">
                        <Col md="5" className="col-12">
                            <h4 class="text-170 text-600 text-primary-d1 letter-spacing">{cartItem.item.name}</h4>
                            <div class="text-secondary-d1 text-120">
                                <span class="text-180">{cartItem.item.category}</span>
                            </div>
                            <div class="text-secondary-d1 text-120">
                                <span class="text-180">{cartItem.item.type}</span>
                            </div>
                        </Col>
                        <Col md="2">
                            <h6 class="text-170 text-600 text-primary-d1 letter-spacing">{cartItem.item.price} €</h6>
                            <FormControl type="number" id={cartItem.item.id} defaultValue={cartItem.quantity} onChange={changeQuantity} step="1" min="1" />
                        </Col>
                        <Col md="3" className="text-center">
                            <h3 class="text-170 text-600 text-primary-d1 letter-spacing">
                                  {(Math.round(cartItem.total * 100) / 100).toFixed(2)} €
                            </h3>
                        </Col>
                        <Col md="2" className="text-center">
                            <Button variant="warning" id={cartItem.item.id} className="me-5" onClick={handleShowConfirmModal}><CartXFill width="24" height="24" /></Button>
                        </Col>
                    </Row>
                </div>
            );
        }
        catch (error) {
            console.log("Exception: " + error);
        }
    };
    
    return (
        <>
            <Row>
                <Col sm="3" />
                <Col>
                    <div className="jumbotron justify-content-start">
                        <h1 class="display-5">Shopping Cart</h1>
                        {
                            !cart || cart.itemsCount === 0 &&
                            <p class="fs-4 fw-light mb-3">
                                Cart Empty
                            </p>
                        }
                        <br />
                        {
                            cart && cart.itemsCount > 0 &&
                            <Stack gap={2} className="mx-auto">
                                {renderItemsList()}
                                <div class="py-3">
                                    <Row className="align-items-center">
                                        <Col md="5" className="col-12">
                                            <h4 class="text-170 text-600 text-primary-d1 letter-spacing">Total</h4>
                                        </Col>
                                        <Col md="2">
                                            <h6 class="text-170 text-600 text-primary-d1 letter-spacing">{cart.itemsCount}</h6>
                                        </Col>
                                        <Col md="3" className="text-center">
                                            <h3 class="text-170 text-600 text-primary-d1 letter-spacing">
                                                  {(Math.round(cart.totalPrice * 100) / 100).toFixed(2)} €
                                            </h3>
                                        </Col>
                                        <Col md="2" />
                                    </Row>
                                </div>
                            </Stack>
                        }
                        <Row className="mt-3">
                        {
                            cart && cart.itemsCount > 0 &&
                            <>
                                <Col>
                                {
                                    (!user || !user.username) &&
                                    <p class="fs-4 fw-light mb-3">
                                User not signed in
                            </p>
                                }
                                {
                                    user && user.username &&
                                    <a class="btn btn-primary" href="/checkout">Proceed to Checkout</a>
                                }
                                </Col>
                                <Col />

                            </>   
                        }
                        {
                            !cart || cart.itemsCount === 0 &&
                            <Col>
                                <a class="btn btn-primary" href="/products">Products</a>
                            </Col>
                        }
                        </Row>
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
            <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{'Remove from cart?'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { 'Are you sure you want to remove the item from the cart?'}
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                    {
                        selectedItem &&
                        <Button variant="warning" id={selectedItem.item.id} onClick={removeFromCart}>Remove</Button>
                    }
                    {
                        !selectedItem &&
                        <Button variant="warning" onClick={clearCart}>Empty cart</Button>
                    }
                    </Col>
                    <Col sm="2" className="justify-content-end">
                        <Button variant="secondary" onClick={handleCloseConfirmModal}>Close</Button>
                    </Col>
                </Modal.Footer>
            </Modal>
        </>
    );
}