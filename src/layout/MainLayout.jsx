import { Link, NavLink, Outlet } from "react-router-dom";
import { useMemo, useState, createContext, useContext, useEffect } from "react";


// Copied--- price utils (EUR formatter) ---
export const EUR = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});
export const formatPrice = (n) => EUR.format(n);


//---------Fetch------------------------------

// 
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

const DataContext = createContext(null);
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used under <DataProvider>");
  return context;
}
// ----------------------------------------------------------------------
function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     

  useEffect(() => {
    let ignore = false;

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    const load = async () => {
      setLoading(true);
      setError(null);

      // simulate some delay 
      await sleep(Math.floor(Math.random() * 800));

      try {
        // fetch both at the same time
        const [cats, prods] = await Promise.all([
          fetchJSON("https://fakestoreapi.com/products/categories"),
          fetchJSON("https://fakestoreapi.com/products"),
        ]);

        if (!ignore) {
          setCategories(cats);
          setProducts(prods);
        }
      } catch (e) {
        if (!ignore) {
          console.error(e);
          setError("Failed to fetch store data.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true; 
    };
  }, []);

  //-----------------------------------------------------------------------------------


  const value = {
    products,
    categories,
    status: loading ? "loading" : error ? "error" : "ready",
    error,
    loading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}


// --- cart state  ---
export default function MainLayout() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeOne = (id) => {
    setCartItems((prev) => {
      const found = prev.find((p) => p.id === id);
      if (!found) return prev;
      if (found.quantity === 1) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p));
    });
  };

  const removeAll = (id) => setCartItems((prev) => prev.filter((p) => p.id !== id));
  const clearCart = () => setCartItems([]);

  const { count, total } = useMemo(() => {
    const count = cartItems.reduce((s, i) => s + i.quantity, 0);
    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    return { count, total };
  }, [cartItems]);

  const outletContext = {
    cartItems, addToCart, removeOne, removeAll, clearCart, count, total,
  };

  function Navbar() {
  
  return (
    <nav className="sticky top-0 bg-white shadow">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        <Link to="/" className="text-xl font-bold">
          Fake eCommerce
        </Link>

        <NavLink to="/" end className="hover:underline">
          Home
        </NavLink>

        {/* right side */}
        <div className="ml-auto flex items-center gap-4">
          {/* Running total */}
          <div className="text-sm text-gray-700">
            Total: <span className="font-semibold">{formatPrice(total)}</span>
          </div>

          {/* Cart link with count badge */}
          <NavLink to="/cart" className="relative inline-flex items-center hover:underline">
            Cart
            {count > 0 && (
              <span
                className="ml-2 inline-flex items-center justify-center
                           rounded-full bg-gray-900 text-white text-xs w-5 h-5"
                aria-label={`Items in cart: ${count}`}
              >
                {count}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}


  return (
    <DataProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Outlet context={outletContext} />
        </main>
      </div>
    </DataProvider>
  );
}
