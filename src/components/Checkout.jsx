import { useContext } from "react";
import useHttp from "../hoooks/useHttp.js";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button.jsx";
import Input from "./UI/Input.jsx";
import Error from "./UI/Error.jsx";
import Modal from "./UI/Modal";

const requestConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + (item.quantity * item.price), 0);

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    sendRequest(JSON.stringify({
      order: {
        items: cartCtx.items,
        customer: customerData
      }
    }));
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>Close</Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending Order Data...</span>
  }

  if (data && !error) {
    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <h2>Successfully sent the order!</h2>
      <p>Order Total: {currencyFormatter.format(cartTotal)}</p>
      <p>Thanks for ordering!</p>
      <p className="modal-actions">
        <Button onClick={handleFinish}>Okay</Button>
      </p>
    </Modal>
  }

  return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label="Full Name" id="name" type="text" />
        <Input label="Email Address" id="email" type="email" />
        <Input label="Street" id="street" type="text" />
        <div>
          <Input label="Postal Code" id="postal-code" type="text" />
          <Input label="City" id="city" type="text" />
        </div>

        {error && <Error title="Failed to submit order.." message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  )
};
