import React from 'react'
import { Row, Col } from 'react-bootstrap';

export default function Completion() {
  return (
    <Row>
        <Col sm="3" />
        <Col>
            <div className="jumbotron justify-content-start">
            <h1 class="display-4">Thank you for your purchase</h1>
            <p class="fs-4 fw-light mb-3">
                Please check your email for delivery details!
            </p>
            </div>
        </Col>
        <Col sm="3" />
    </Row>
  );
}