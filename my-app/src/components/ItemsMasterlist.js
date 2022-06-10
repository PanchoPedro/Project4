import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Modal, Form, FormControl, Card, Button, Row, Col } from 'react-bootstrap';

export default function ItemsMasterlist() {
    const [products, setProducts] = useState({})
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showEntityEditorModal, setShowEntityEditorModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    
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
        fetchProducts();
    }, []);
    
    function fetchProducts() {
        fetch("http://localhost:3003/items")
            .then((response) => response.json())
            .then((json) => setProducts(json))
            .catch(console.log);
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

        setSelectedItem(products.find(item => item.id === parseInt(id)));
        
        setShowConfirmModal(true);
    };

    const handleCloseEntityEditorModal = () => {
        setSelectedItem(""); 
        setShowEntityEditorModal(false);
    };
    
    const handleShowEntityEditorModal = (e) => {
        if(e.target.id !== "addNew") {
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
            
            setSelectedItem(products.find(item => item.id === parseInt(id))); 
        }
        else
            setSelectedItem(""); 
        
        setShowEntityEditorModal(true);
    };
    
    const addNewItem = (e) => {
        e.preventDefault();
        console.log(e);
        let newItem = {
            name: e.target.itemName.value,
            category: e.target.itemCategory.value,
            type: e.target.itemType.value,
            price: e.target.itemPrice.value
        };
        console.log(newItem);
        fetch("http://localhost:3003/items/", {
            method: "POST",
            headers : { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        })
            .then((response) => console.log(response.json()))
            .catch(console.log);
        fetchProducts();
        handleCloseEntityEditorModal();
        window.location.reload(false);
    }
    
    const editItem = (e) => {
        e.preventDefault();
        console.log(e);
        let item = {
            name: e.target.itemName.value,
            category: e.target.itemCategory.value,
            type: e.target.itemType.value,
            price: e.target.itemPrice.value
        };
        console.log(item);
        fetch("http://localhost:3003/items/" + e.target.itemId.value, {
            method: "PUT",
            headers : { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then((response) => console.log(response.json()))
            .catch(console.log);
        fetchProducts();
        handleCloseEntityEditorModal();
        window.location.reload(false);
    }
    
    const deleteItem = (e) => {
        fetch("http://localhost:3003/items/" + e.target.id, {
            method: "DELETE"
        })
            .then((response) => console.log(response.json()))
            .catch(console.log);
        fetchProducts();
        handleCloseConfirmModal();
        window.location.reload(false);
        e.preventDefault();
    }
    
    const renderItemsList = () => {
        try {
            return products.map((entry) =>
                <Col className="my-1 align-items-center justify-content-center">
                    <Card className="mx-2 align-self-center" style={{ width: '15rem' }}>
                        <Card.Header>
                            <Card.Img variant="fluid" src="item.jpg" style={{height: '9rem'}} />
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>#{entry.id}<br />{entry.name}</Card.Title>
                            <Card.Subtitle>{entry.category}</Card.Subtitle>
                            <Card.Text>{entry.type}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <h6 class="text-170 text-600 text-primary-d1 letter-spacing">{entry.price} €</h6>
                            <Row>
                                <Col>
                                    <Button variant="warning" className="px-4" id={entry.id} onClick={handleShowEntityEditorModal}>Edit</Button>
                                </Col>
                                <Col>
                                    <Button variant="danger" id={entry.id} onClick={handleShowConfirmModal}>Delete</Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
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
                    <div className="jumbotron">
                        <h1 class="display-5">Products</h1>
                        <br />
                        <Button id="addNew" variant="primary" className="w-25 mb-3 px-3" onClick={handleShowEntityEditorModal}>Add new</Button>
                        {
                            products &&
                            <Row className="row-cols-md-3 align-items-center justify-content-center">
                                {renderItemsList()}
                            </Row>
                        }
                    </div>
                </Col>
                <Col sm="3" />
            </Row>
            <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Item?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>Are you sure you want to delete the item from the database?<br />This action can&apos;t be undone!</span>
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        <Button variant="danger" id={selectedItem.id} onClick={deleteItem}>Delete</Button>
                    </Col>
                    <Col sm="2" className="justify-content-end">
                        <Button variant="secondary" onClick={handleCloseConfirmModal}>Close</Button>
                    </Col>
                </Modal.Footer>
            </Modal>
            <Modal show={showEntityEditorModal} onHide={handleCloseEntityEditorModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedItem ? 'Edit Item?' : 'Add new Item'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={selectedItem ? editItem : addNewItem}>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col md="6">
                                <Form.Label htmlFor="itemId">ID</Form.Label>
                                <FormControl type="text" id="itemId" name="itemId" placeholder="Item ID" defaultValue={selectedItem ? selectedItem.id : ''} disabled readonly />
                            </Col>
                            <Col md="6" />
                        </Row>
                        <Row className="mb-3">
                            <Col md="6">
                                <Form.Label htmlFor="itemName">Name</Form.Label>
                                <FormControl type="text" id="itemName" name="itemName" placeholder="Item name" defaultValue={selectedItem ? selectedItem.name : ''}  required />
                            </Col>
                            <Col md="6">
                                <Form.Label htmlFor="itemPrice">Price</Form.Label>
                                <FormControl type="number" id="itemPrice" name="itemPrice" min="0.01" step="0.01" placeholder="Item price" defaultValue={selectedItem ? selectedItem.price : ''} required />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md="6">
                                <Form.Label htmlFor="itemCategory">Category</Form.Label>
                                <FormControl type="text" id="itemCategory" name="itemCategory" placeholder="Item category" defaultValue={selectedItem ? selectedItem.category : ''}  required />
                            </Col>
                            <Col md="6">
                                <Form.Label htmlFor="itemType">Type</Form.Label>
                                <FormControl type="text" id="itemType" name="itemType" placeholder="Item type" defaultValue={selectedItem ? selectedItem.type : ''}  required />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Col>
                            <Button variant="warning" type="submit">Save</Button>
                        </Col>
                        <Col sm="2" className="justify-content-end">
                            <Button variant="secondary" onClick={handleCloseEntityEditorModal}>Close</Button>
                        </Col>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}