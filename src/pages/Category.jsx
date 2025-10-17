import { useParams, Link } from "react-router-dom";
import { useData, formatPrice } from "../layout/MainLayout";
import { useOutletContext } from "react-router-dom";

function ProductCard({ product }) {
  const { id, title, price, category, image } = product;
  const { cartItems, addToCart, removeOne, removeAll } = useOutletContext();
  const inCart = cartItems.find((i) => i.id === id);
  const qty = inCart?.quantity ?? 0;

  return (
    <div className="rounded-xl border bg-yellow-300 p-4 shadow-sm flex flex-col">
      <img src={image} alt={title} className="h-40 object-contain mb-3" loading="lazy" />
      <Link to={`/category/${encodeURIComponent(category)}`} className="text-xs text-gray-600 hover:underline">
        {category}
      </Link>
      <h3 className="mt-1 text-sm font-medium line-clamp-2">{title}</h3>
      <div className="mt-2 text-base font-semibold">{formatPrice(price)}</div>

      {!inCart ? (
        <button className="mt-3 rounded bg-gray-900 px-3 py-2 text-white"
                onClick={() => addToCart({ id, title, price })}>
          Add to cart
        </button>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <button className="rounded bg-gray-200 px-3 py-2" onClick={() => removeOne(id)}>−</button>
          <span className="min-w-[2ch] text-center">{qty}</span>
          <button className="rounded bg-gray-200 px-3 py-2" onClick={() => addToCart({ id, title, price })}>+</button>
          <button className="ml-auto rounded bg-red-600 px-3 py-2 text-white" onClick={() => removeAll(id)}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default function Category() {
  const { name } = useParams();                     // from /category/:name
  const { products, status, error, loading } = useData();

  if (loading) return <p>Loading…</p>;
  if (status === "error") return <p className="text-red-600">{error}</p>;
  if (status !== "ready") return null;

  const decoded = decodeURIComponent(name || "");
  const list = products.filter((p) => p.category === decoded);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Category: {decoded}</h1>
      {list.length === 0 ? (
        <p>No products found for this category.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <Link to="/" className="inline-block mt-4 text-sm underline">← Back to Home</Link>
    </div>
  );
}
