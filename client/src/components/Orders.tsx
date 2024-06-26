import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Order {
    cart: Array<{ item: string, quantity: number, price: number }>;
    email: string;
    orderID: string
    totalPrice: number;
    userID: string;
}

const Orders: React.FC<{ user: any }> = ({ user }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get<Order[]>(`${process.env.REACT_APP_HOST_URL}:${process.env.REACT_APP_SERVER_PORT}/getOrders`, {
                    headers: { Authorization: `Bearer ${user.Token}` }
                });
                setOrders(response.data.filter(order => order.userID === user.id));
                ;
            } catch (error) {
                console.error('ERROR: could not fetch orders:', error);
            }
        };

        if (user.Token) {
            fetchOrders();
        }
    }, [user.Token]);

    return (
        <div>
            <h1>Orders</h1>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {orders?.map((order: Order) => (
                    <div key={order.orderID} className="col">
                        <div className="card bg-dark text-light">
                            <div className="card-body">
                                <h5 className="card-title">Order ID: {order.orderID}</h5>
                                <p className="card-text">Items: {order.cart.map(item => `${item.item} (x${item.quantity})`).join(', ')}</p>
                                <p className="card-text">Total: ${order.totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
