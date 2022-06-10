import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Modal, Stack, Form, FormControl, Button, Row, Col } from 'react-bootstrap';

export default function UsersMasterlist() {
    const [users, setUsers] = useState({})
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showEntityEditorModal, setShowEntityEditorModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    
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
        fetchUsers();
    }, []);
    
    function fetchUsers() {
        fetch("http://localhost:3003/users")
            .then((response) => response.json())
            .then((json) => setUsers(json))
            .catch(console.log);
    }

    const handleCloseConfirmModal = () => {
        setSelectedUser(""); 
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

        setSelectedUser(users.find(user => user.id === parseInt(id)));
        
        setShowConfirmModal(true);
    };

    const handleCloseEntityEditorModal = () => {
        setSelectedUser(""); 
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
            
            setSelectedUser(users.find(user => user.id === parseInt(id))); 
        }
        else
            setSelectedUser(""); 
        
        setShowEntityEditorModal(true);
    };
    
    const addNewUser = (e) => {
        e.preventDefault();
        let newUser = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            role: e.target.role.value
        };
        fetch("http://localhost:3003/users/", {
            method: "POST",
            headers : { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then((response) => console.log(response.json()))
            .catch(console.log);
        fetchUsers();
        handleCloseEntityEditorModal();
        window.location.reload(false);
    }
    
    const editUser = (e) => {
        e.preventDefault();
        let user = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            role: e.target.role.value
        };
        fetch("http://localhost:3003/users/" + e.target.userId.value, {
            method: "PUT",
            headers : { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then((response) => console.log(response.json()))
            .catch(console.log);
        fetchUsers();
        handleCloseEntityEditorModal();
        window.location.reload(false);
    }
    
    const deleteUser = (e) => {
        fetch("http://localhost:3003/users/" + e.target.id, {
            method: "DELETE"
        })
            .then((response) => console.log(response.json()))
            .catch(console.log);
        fetchUsers();
        handleCloseConfirmModal();
        window.location.reload(false);
        e.preventDefault();
    }
    
    const renderItemsList = () => {
        try {
            return users.map((user) =>
                <div class="d-style bg-light py-3 shadow-sm">
                    <Row className="align-items-center">
                        <Col md="2">
                            <h2 class="text-170 text-600 text-primary-d1 letter-spacing">#{user.id}</h2>
                        </Col>
                        <Col md="5" className="col-12">
                            <h4 class="text-170 text-600 text-primary-d1 letter-spacing">{user.username}</h4>
                            <div class="text-secondary-d1 text-120">
                                <span class="text-180">{user.email}</span>
                            </div>
                        </Col>
                        <Col md="3" className="text-center">
                            <h4 class="text-170 text-600 text-primary-d1 letter-spacing">{user.role === 'admin' ? 'Administrator' : 'Customer'}</h4>
                        </Col>
                        <Col md="2" className="text-center">
                            <Button variant="warning" className="px-3 mb-2" id={user.id} onClick={handleShowEntityEditorModal}>Edit</Button>
                             <br />
                            <Button variant="danger" id={user.id} onClick={handleShowConfirmModal}>Delete</Button>
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
                    <div className="jumbotron">
                        <h1 class="display-5">Users</h1>
                        <br />
                        <Button id="addNew" variant="primary" className="w-25 mb-3 px-3" onClick={handleShowEntityEditorModal}>Add new</Button>
                        {
                            users &&
                            <Stack gap={2} className="mx-auto">
                                {renderItemsList()}
                            </Stack>
                        }
                    </div>
                </Col>
                <Col sm="3" />
            </Row>
            <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>Are you sure you want to delete the selected User from the database?<br />This action can&apos;t be undone!</span>
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        <Button variant="danger" id={selectedUser.id} onClick={deleteUser}>Delete</Button>
                    </Col>
                    <Col sm="2" className="justify-content-end">
                        <Button variant="secondary" onClick={handleCloseConfirmModal}>Close</Button>
                    </Col>
                </Modal.Footer>
            </Modal>
            <Modal show={showEntityEditorModal} onHide={handleCloseEntityEditorModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser ? 'Edit User?' : 'Add new User'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={selectedUser ? editUser : addNewUser}>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col md="6">
                                <Form.Label htmlFor="userId">ID</Form.Label>
                                <FormControl type="text" id="userId" name="userId" placeholder="Item ID" defaultValue={selectedUser ? selectedUser.id : ''} disabled readonly />
                            </Col>
                            <Col md="6" />
                        </Row>
                        <Row className="mb-3">
                            <Col md="6">
                                <Form.Label htmlFor="username">Username</Form.Label>
                                <FormControl type="text" id="username" name="username" placeholder="Username" defaultValue={selectedUser ? selectedUser.username : ''}  required />
                            </Col>
                            <Col md="6">
                                <Form.Label htmlFor="email">Email</Form.Label>
                                <FormControl type="text" id="email" name="email" placeholder="User email" defaultValue={selectedUser ? selectedUser.email : ''} required />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md="6">
                                <Form.Label htmlFor="password">Password</Form.Label>
                                <FormControl type="password" id="password" name="password" placeholder="User password" defaultValue={selectedUser ? selectedUser.password : ''}  required />
                            </Col>
                            <Col md="6">
                                <Form.Label htmlFor="role">Role</Form.Label>                                  
                                <Form.Select id="role" name="role" required>
                                    <option value="customer" selected={!selectedUser || selectedUser.role === 'customer' ? 'selected' : ''}>Customer</option>
                                    <option value="admin" selected={selectedUser && selectedUser.role === 'admin' ? 'selected' : ''}>Administrator</option>
                                </Form.Select>
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