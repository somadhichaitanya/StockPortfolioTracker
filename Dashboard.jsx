import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PortfolioChart from './PortfolioChart';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [newStock, setNewStock] = useState({
    stock_symbol: "",
    quantity: "",
    buy_price: "",
  });

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const token = localStorage.getItem("token");

  const api = "http://localhost:5001/api/portfolio";
  const stocksApi = "http://localhost:5001/api/stocks/search";
  const debounceRef = useRef(null);

  // Fetch portfolio on load
  useEffect(() => {
    if (!token) return;
    fetchPortfolio();
  }, [token]);

  // AUTOCOMPLETE: Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(api, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPortfolio(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const doSearch = async (q) => {
    try {
      setSearchLoading(true);

      const res = await axios.get(stocksApi, {
        params: { q },
        timeout: 8000,
      });

      setSuggestions(res.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectSuggestion = (s) => {
    setNewStock({ ...newStock, stock_symbol: s.symbol });
    setQuery(`${s.symbol} • ${s.name}`);
    setSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "stock_symbol") {
      setQuery(value);
      setNewStock({ ...newStock, stock_symbol: value });
    } else {
      setNewStock({ ...newStock, [name]: value });
    }
  };

  const addStock = async (e) => {
    e.preventDefault();

    try {
      await axios.post(api, newStock, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewStock({ stock_symbol: "", quantity: "", buy_price: "" });
      setQuery("");
      fetchPortfolio();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error adding stock");
    }
  };

  const deleteStock = async (id) => {
    if (!confirm("Delete this holding?")) return;

    try {
      await axios.delete(`${api}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchPortfolio();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Totals
  const totalInvestment = portfolio.reduce(
    (s, p) => s + Number(p.buy_price) * Number(p.quantity),
    0
  );
  const currentValue = portfolio.reduce(
    (s, p) => s + (p.latestPrice || 0) * Number(p.quantity),
    0
  );
  const pl = currentValue - totalInvestment;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-600 rounded-lg"
          >
            Logout
          </button>
        </header>

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-sm text-white/70">Total Investment</h3>
            <p className="text-2xl font-semibold mt-2">₹ {totalInvestment.toFixed(2)}</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-sm text-white/70">Current Value</h3>
            <p className="text-2xl font-semibold mt-2">₹ {currentValue.toFixed(2)}</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-sm text-white/70">Unrealized P/L</h3>
            <p
              className={`text-2xl font-semibold mt-2 ${
                pl >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ₹ {pl.toFixed(2)}
            </p>
          </div>
        </section>

        {/* ADD STOCK */}
        <section className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6 relative">
          <h2 className="text-xl font-semibold mb-4">Add Stock</h2>

          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            onSubmit={addStock}
            autoComplete="off"
          >
            {/* SYMBOL INPUT + AUTOCOMPLETE */}
            <div className="relative md:col-span-1">
              <input
                name="stock_symbol"
                placeholder="Symbol or company name"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setNewStock({
                    ...newStock,
                    stock_symbol: e.target.value,
                  });
                }}
                className="p-3 bg-white/5 text-white rounded w-full"
              />

              {/* SUGGESTIONS */}
              {suggestions.length > 0 && (
                <ul className="absolute z-50 bg-white/10 backdrop-blur-md border border-white/10 mt-1 w-full max-h-48 overflow-auto rounded">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSelectSuggestion(s)}
                      className="px-3 py-2 cursor-pointer hover:bg-white/20"
                    >
                      <div className="font-semibold">{s.symbol}</div>
                      <div className="text-xs text-gray-300">{s.name}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* QUANTITY */}
            <input
              name="quantity"
              placeholder="Quantity"
              type="number"
              value={newStock.quantity}
              onChange={handleChange}
              className="p-3 bg-white/5 rounded"
            />

            {/* BUY PRICE */}
            <input
              name="buy_price"
              placeholder="Buy Price"
              type="number"
              value={newStock.buy_price}
              onChange={handleChange}
              className="p-3 bg-white/5 rounded"
            />

            {/* ADD BUTTON */}
            <button className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded">
              Add
            </button>
          </form>

          {searchLoading && (
            <div className="text-xs text-white/60 mt-2">Searching...</div>
          )}
        </section>

        {/* HOLDINGS TABLE */}
        <section className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
          <h2 className="text-xl font-semibold mb-4">Holdings</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-white/70">
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                  <th>Buy Price</th>
                  <th>Latest</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {portfolio.map((p) => (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="py-3">{p.stock_symbol}</td>
                    <td>{p.quantity}</td>
                    <td>{p.buy_price}</td>
                    <td>{p.latestPrice || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => deleteStock(p.id)}
                        className="px-3 py-1 bg-red-600 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CHART */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Chart</h2>
          <PortfolioChart
            labels={portfolio.map((p) => p.stock_symbol)}
            dataPoints={portfolio.map(
              (p) => (p.latestPrice || 0) * Number(p.quantity)
            )}
          />
        </section>
      </div>
    </div>
  );
}
