import { useOutletContext } from "react-router-dom";
import { formatPrice } from "../layout/MainLayout";

export default function Cart() {
  const { cartItems, addToCart, removeOne, removeAll, clearCart, total } =
    useOutletContext();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Your Shopping List</h1>

      {cartItems.length === 0 ? (
        <p>YYour Shopping List is empty.</p>
      ) : (
        <ul className="space-y-2">
          {cartItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <span className="font-medium">{item.title}</span>
              <span>{formatPrice(item.price)}</span>
              <span>qty: {item.quantity}</span>
              <button
                className="px-2 py-1 bg-gray-200 rounded"
                onClick={() => addToCart(item)}
              >
                +1
              </button>
              <button
                className="px-2 py-1 bg-gray-200 rounded"
                onClick={() => removeOne(item.id)}
              >
                -1
              </button>
              <button
                className="px-2 py-1 bg-gray-200 rounded"
                onClick={() => removeAll(item.id)}
              >
                remove
              </button>
              <span className="ml-auto">
                {/* line total: price * quantity */}
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="pt-2 border-t text-lg font-semibold">
        Total: {formatPrice(total)}
      </div>

      <button
        className="px-3 py-1 rounded bg-red-600 text-white"
        onClick={clearCart}
      >
        Clear cart
      </button>
    </div>
  );
}
