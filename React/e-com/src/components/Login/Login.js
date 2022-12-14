import React, { useState, useContext, useRef } from "react";
import { Card, Container, Form, Row, Col, Button } from "react-bootstrap";
import Header from "../UI/Header";
import axios from "axios";
import AuthContext from "../../store/auth-contex";
import { useNavigate } from "react-router-dom";
import CartContext from "../../store/cart-context";

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const navigate = useNavigate();

  const ctx = useContext(AuthContext);
  const Cartctx = useContext(CartContext);
  const formattedEmail = Cartctx.userEmail;

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onCartClickHander = async () => {
    await axios
      .get(
        `https://crudcrud.com/api/3df8f823cd5f4ceca0027adedf3cc7c6/cart${formattedEmail}`
      )
      .then((res) => {
        console.log(res);
        Cartctx.addItem(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // setReceivedData(response.data[0].elements);
  };

  const submitFormHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    // onCartClickHander();

    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCjXn3ZuxwRU-mb7uz8vrpXFkfFPQfxZWY";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        retrunSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication Failed";
            alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // const expirationTime = new Date(
        //   new Date().getTime() + Number(data.expiresIn * 1000)
        // );
        console.log(data);
        ctx.login(data.idToken);
        localStorage.setItem("token", data.idToken);
        localStorage.setItem("email", data.email);

        navigate("/store");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <>
      <Header />
      <Container style={{ height: "300px", width: "300px", border: "black" }}>
        <Card style={{ height: "400px", width: "500px", marginLeft: "-110px" }}>
          <Card.Header
            style={{ fontFamily: "sans", background: "white", border: "white" }}
          >
            <h3 style={{ marginLeft: "40%" }}>LOGIN</h3>
          </Card.Header>
          <Card.Body>
            <Form
              style={{
                marginLeft: "30px",
                fontFamily: "serif",
                marginTop: "20px",
                marginRight: "30px",
                padding: "10px",
              }}
            >
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    ref={emailRef}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    ref={passwordRef}
                  />
                </Form.Group>
              </Row>
              <Button
                variant="primary"
                type="submit"
                style={{ width: "180px", height: "40px", marginLeft: "25%" }}
                onClick={submitFormHandler}
              >
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Login;
