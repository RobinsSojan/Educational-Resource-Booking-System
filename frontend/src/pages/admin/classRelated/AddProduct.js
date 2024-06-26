import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../../redux/productRelated/productActions';
import { resetStatus } from '../../../redux/productRelated/productSlice';
import { GreenButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import ProductImage from "../../../assets/product.png";
import styled from "styled-components";

const AddProduct = () => {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productState = useSelector(state => state.product);
    const { status, response, error, tempProduct } = productState;

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        name: productName,
        price: productPrice,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addProduct(fields));
    };

    useEffect(() => {
        if (status === 'added' && tempProduct) {
            navigate("/Admin/products/product/" + tempProduct._id);
            dispatch(resetStatus());
            setLoader(false);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch, tempProduct]);

    return (
        <>
            <StyledContainer>
                <StyledBox>
                    <Stack sx={{ alignItems: 'center', mb: 3 }}>
                        <img
                            src={ProductImage}
                            alt="product"
                            style={{ width: '80%' }}
                        />
                    </Stack>
                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                label="Product Name"
                                variant="outlined"
                                value={productName}
                                onChange={(event) => setProductName(event.target.value)}
                                required
                            />
                            <TextField
                                label="Product Price"
                                variant="outlined"
                                value={productPrice}
                                onChange={(event) => setProductPrice(event.target.value)}
                                required
                                type="number"
                            />
                            <GreenButton
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                variant="contained"
                                type="submit"
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
                            </GreenButton>
                            <Button variant="outlined" onClick={() => navigate(-1)}>
                                Go Back
                            </Button>
                        </Stack>
                    </form>
                </StyledBox>
            </StyledContainer>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
}

export default AddProduct;

const StyledContainer = styled(Box)`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  max-width: 550px;
  padding: 50px 3rem 50px;
  margin-top: 1rem;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  border-radius: 8px;
`;
