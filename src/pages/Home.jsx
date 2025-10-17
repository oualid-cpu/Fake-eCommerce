import { Link, useOutletContext } from "react-router-dom";
import { useData, formatPrice } from "../layout/MainLayout";


// CategoryPills 
function CategoryPills() {
  const { categories, status } = useData();
  if (status !== "ready") return null;
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((name) => (
        <Link key={name} to={`/category/${encodeURIComponent(name)}`}
              className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300">
          {name}
        </Link>
      ))}
    </div>
  );
}

// ProductCard (new)
function ProductCard({ product }) {
  const { id, title, price, category, image } = product;
  const { cartItems, addToCart, removeOne, removeAll } = useOutletContext();
  const inCart = cartItems.find((i) => i.id === id);
  const qty = inCart?.quantity ?? 0;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col">
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

// 3) Home component 
export default function Home() {
  const { count } = useOutletContext();
  const { products, status, error, loading } = useData();

  if (loading) return <p>Loading…</p>;
  if (status === "error") return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* <h1 className="text-2xl font-semibold">Home</h1>
      <p className="text-gray-600">Cart count: {count}</p> */}

      <section>
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <CategoryPills />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Products</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
