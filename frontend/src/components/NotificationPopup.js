import * as React from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { clearWishlist } from '../redux/wishlistSlice';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';

const NotificationPopup = ({ message, setShowPopup, showPopup }) => {
    const dispatch = useDispatch();

    const vertical = "bottom";
    const horizontal = "left";

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowPopup(false);
        dispatch(clearCart());
        dispatch(clearWishlist());
    };

    return (
        <>
            <Snackbar open={showPopup} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
                {
                    (message === "Order placed successfully") ?
                        <StyledAlert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            {message}
                        </StyledAlert>
                        :
                        <StyledAlert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                            {message}
                        </StyledAlert>
                }
            </Snackbar>
        </>
    );
};

export default NotificationPopup;

const StyledAlert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
