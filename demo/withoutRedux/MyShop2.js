import api from 'api';
import { without, concat } from 'lodash';

class MyShop extends Component {
  constructor(props) {
    super(props);
    this.state = { order: {}, products: [] };
  }

  componentWillMount() {
    Promise.all([
      api.shop.getProducts(),
      api.shop.getCurrentOrder()
    ]).then(([products, order]) => {
      // Benefit 1: No pre-processing of our data from the server
      this.setState({ products, order });
    });
  }

  toggleProductInOrder(product) {
    const { products, order } = this.state;
    const selectedProduct = this.getSelected(product);

    // Benefit 2: Updating an order is just adding or removing on item
    // from an array. You get to send the data as-is to the API.
    const updatedOrder = !selectedProduct
      ? { ...order, products: concat(order.products, product) }
      : { ...order, products: without(order.products, product) };

    return api.shop.updateOrder(updatedOrder)
      .then(newOrder => {
        // Benefit 3: After updating the order, just one piece
        // of data must be changed on state
        this.setState({ order: newOrder });
      });
  }

  getSelected(product) {
    return this.state.order.products.find(p => p.id === product.id);
  }

  render() {
    const { order, products } = this.state;

    // Benefit 4: The render code barely changed,
    // but the logic and data juggling is gone!
    return (
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name}
            <button
              type="button"
              onClick={() => this.toggleProductInOrder(product)}>
              {!this.getSelected(product) ? '+ Add' : '- Remove'}
            </button>
          </li>
        )}
      </ul>
    );
  }
}