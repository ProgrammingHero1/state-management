import React, { Component } from 'react';
import api from 'api';

class MyShop extends Component {
    constructor(props) {
        super(props);
        this.state = { products: [], order: {} };
    }

    componentWillMount() {
        Promise.all([
            api.shop.getProducts(),
            api.shop.getCurrentOrder()
        ]).then(([products, order]) => {
            // Get the ids of all the products that are in my order now
            const orderProductIds = order.products.map(p => p.id);

            // Set a "selected" flag on the item in the list of all products
            const uiProducts = products.map(p => {
                const selected = orderProductIds.indexOf(p.id) !== -1;
                return { ...p, selected };
            });

            this.setState({ products: uiProducts, order });
        });
    }

    toggleProductInOrder(product) {
        // Take all our products, flip the selected one,
        // and get a new list to send to the server
        const newProducts = this.state.products.map(p => {
            if (product.id !== p.id) { return p; }
            return { ...p, selected: !p.selected };
        });

        // Filter out the selected products
        const newOrderProducts = newProducts.filter(p => p.selected);
        const updatedOrder = { ...this.state.order, products: newOrderProducts };

        // Update both the order and the products
        return api.shop.updateOrder(updatedOrder)
            .then(newOrder => {
                this.setState({ order: newOrder, products: newProducts });
            });
    }

    render() {
        return (
            <ul>
                { this.state.products.map(product => (
                    <li key={product.id}>
                        {product.name}
                        <button onClick={e => this.toggleProductInOrder(product)}>
                            {!product.selected ? '+ Add' : '- Remove'}
                        </button>
                    </li>
                )}
            </ul>
        );
    }
}