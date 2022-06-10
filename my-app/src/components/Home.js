import React, { useState, useEffect } from 'react'
import { Container, Card, Form, FormControl, Button, Row, Col } from 'react-bootstrap';
import { CartPlusFill } from 'react-bootstrap-icons';

export default function Home() {
    const [products, setProducts] = useState({})
    const [searchResult, setSearchResult] = useState()
    const [cart, setCart] = useState({
        totalPrice: 0,
        itemsCount: 0,
        items: []
    })
    
    useEffect(() => {
        fetchProducts();
        
        let currentCart = localStorage.getItem("cart");
        if(currentCart && currentCart !== "undefined")
            setCart(JSON.parse(currentCart));
    }, []);
    
    function fetchProducts() {
        fetch("http://localhost:/items")
            .then((response) => response.json())
            .then((json) => setProducts(json))
            .catch(console.log);
    }
    
    const addToCart = (e) => {
        let cartItem = {
            item: JSON.parse(e.target.item.value),
            quantity: parseInt(e.target.quantity.value)
        };
        cartItem["total"] = cartItem.item.price * cartItem.quantity;
        console.log(cartItem);
        
        let index = cart.items.findIndex(item => item.item.id === cartItem.item.id);
        if(index !== -1) {
            cart.items[index].quantity = cart.items[index].quantity + cartItem.quantity;
            cart.items[index].total = cart.items[index].total + cartItem.total;
        } else
            cart.items.push(cartItem);
        
        cart.totalPrice = cart.totalPrice + cartItem.total;
        cart.itemsCount = cart.itemsCount + cartItem.quantity;
        console.log(cart);
        localStorage.setItem("cart", JSON.stringify(cart));
        e.preventDefault();
        //window.location.reload(false);
    }
    
    const handleSearch = (e) => {
        e.preventDefault();
        const regexp = new RegExp(e.target.search.value, 'i');
        setSearchResult(products.filter(item => regexp.test(item.name)));
    };
    
    const renderResultItemsList = () => {
        try {
            return searchResult.map((entry) =>
                <Col className="my-1 align-items-center justify-content-center">
                    <Card className="mx-2 align-self-center" style={{ width: '15rem' }}>
                        <Card.Header>
                            <Card.Img variant="fluid" src="item.jpg" style={{height: '9rem'}} />
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>{entry.name}</Card.Title>
                            <Card.Subtitle>{entry.category}</Card.Subtitle>
                            <Card.Text>{entry.type}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <h6 class="text-170 text-600 text-primary-d1 letter-spacing">{entry.price} €</h6>
                            <Form onSubmit={addToCart} className="d-flex align-items-center justify-content-center">
                                <FormControl type="hidden" id="item" name="item" value={JSON.stringify(entry)} />
                                <FormControl type="number" className="me-5" id="quantity" name="quantity" min="1" defaultValue="1" step="1" />
                                <Button variant="primary" type="submit" className="ms-4">
                                    <CartPlusFill width="24" height="24" />
                                </Button>
                            </Form>
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
      <Row>
        <Col sm="3" />
        <Col>
            <div className="jumbotron">
                <h1 class="display-5">Kitchen Story Webstore - Welcome</h1>
                <p class="fs-4 fw-light mb-3">Search for groceries</p>
                <br/>
                <Form className="needs-validation" onSubmit={handleSearch}>
                    <Container className="mb-1 w-75">
                        <FormControl type="text" id="search" name="search" placeholder="Search..." required />
                    </Container>
                    <Button type="submit" variant="primary" className="w-25 mt-4">Search</Button>
                </Form>
            </div>
            {
                searchResult &&
                <div className="jumbotron">
                    <h1 class="display-5">Search Result</h1>
                    {
                        searchResult.length === 0 &&
                        <p class="fs-4 fw-light mb-3">No groceries found.</p>
                    }
                    <br />
                    {
                        searchResult.length > 0 &&
                        <Row className="row-cols-md-3 align-items-center justify-content-center">
                            {renderResultItemsList()}
                        </Row>
                    }
                </div>
            }
        </Col>
        <Col sm="3" />
      </Row>
    )
}