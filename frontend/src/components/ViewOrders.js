import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../redux/orderRelated/orderActions';
import { Paper } from '@mui/material';
import TableViewTemplate from './TableViewTemplate';

const ViewOrders = () => {
    const dispatch = useDispatch();

    const { currentUser, currentRole } = useSelector(state => state.user);
    const { ordersList, loading, error, response } = useSelector((state) => state.order);

    useEffect(() => {
        if (currentRole === "Admin") {
            dispatch(getAllOrders(currentUser._id, "Order"));
        } else {
            dispatch(getAllOrders(currentUser.store._id, "Order"));
        }
    }, [dispatch]);

    if (error) {
        console.log(error);
    }

    const orderColumns = [
        { id: 'orderNumber', label: 'Order Number', minWidth: 150 },
        { id: 'customerName', label: 'Customer Name', minWidth: 150 },
        { id: 'status', label: 'Status', minWidth: 120 },
        { id: 'total', label: 'Total', minWidth: 100, align: 'right', format: (value) => `$${value.toFixed(2)}` },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const orderRows = ordersList.map((order) => {
        const date = new Date(order.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            status: order.status,
            total: order.total,
            date: dateString,
            id: order._id,
        };
    });

    return (
        <div style={{ marginTop: '50px', marginRight: '20px' }}>
            {loading ? (
                <div style={{ fontSize: '20px', color: '#000' }}>Loading...</div>
            ) : response ? (
                <div style={{ fontSize: '20px', color: '#000' }}>No Orders to Show Right Now</div>
            ) : (
                <>
                    <h3 style={{ fontSize: '30px', marginBottom: '40px', color: '#000' }}>Orders</h3>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {Array.isArray(ordersList) && ordersList.length > 0 &&
                            <TableViewTemplate columns={orderColumns} rows={orderRows} />
                        }
                    </Paper>
                </>
            )}
        </div>
    );
};

export default ViewOrders;
