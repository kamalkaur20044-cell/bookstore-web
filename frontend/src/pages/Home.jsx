import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/book/BookCard";
import { getBooks } from "../services/book.service";
import toast from "react-hot-toast";
import heroBg from "../assets/hero-bg.png";

export default function Home() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getBooks();
            setBooks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch books:", err);
            setError("Failed to load books. Please try again.");
            toast.error("Failed to load books");
        } finally {
            setLoading(false);
        }
    };

    // Best sellers: first 6 books, filtered by search query
    const bestsellerBase = books.slice(0, 6);
    const bestsellers = search.trim()
        ? books.filter((b) =>
            b.title?.toLowerCase().includes(search.toLowerCase()) ||
            b.author?.toLowerCase().includes(search.toLowerCase())
          )
        : bestsellerBase;
    // New arrivals: most recently added books by insertion order
    const newArrivals = [...books].reverse().slice(0, 6);

    // Carousel: show 3 cards at a time
    const cardsPerView = 3;
    const maxIndex = Math.max(0, newArrivals.length - cardsPerView);
    const visibleArrivals = newArrivals.slice(carouselIndex, carouselIndex + cardsPerView);

    const prevSlide = () => setCarouselIndex((i) => Math.max(0, i - 1));
    const nextSlide = () => setCarouselIndex((i) => Math.min(maxIndex, i + 1));

    const categories = [
        { name: "Fiction", icon: "📚", count: "500+ Books" },
        { name: "Non-Fiction", icon: "✏️", count: "300+ Books" },
        { name: "Mystery", icon: "🔍", count: "200+ Books" },
        { name: "Science Fiction", icon: "🚀", count: "180+ Books" },
        { name: "Biography", icon: "👤", count: "150+ Books" },
        { name: "Self-Help", icon: "💡", count: "250+ Books" },
    ];

    const features = [
        { title: "Fast Delivery", description: "Quick and reliable book delivery", icon: "📦" },
        { title: "Secure Payments", description: "100% safe transactions guaranteed", icon: "🔒" },
        { title: "Easy Returns", description: "Hassle-free return experience", icon: "↩️" },
        { title: "Expert Recommendations", description: "Curated picks by book lovers", icon: "⭐" },
    ];

    const renderBooks = (list, label) => {
        if (loading) {
            return (
                <div className="col-span-3 flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }
        if (error) {
            return (
                <p className="col-span-3 text-center text-red-500">{error}</p>
            );
        }
        if (list.length === 0) {
            return (
                <p className="col-span-3 text-center text-slate-500">No {label} available yet.</p>
            );
        }
        return list.map((book) => <BookCard key={book._id} book={book} />);
    };

    return (
        <div className="bg-slate-50">
            {/* Hero Section */}
            <section
                className="relative p-10 min-h-[80vh] flex items-center text-white bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto w-full">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                                Welcome to BookSphere
                            </span>

                            <h1 className="text-5xl md:text-6xl font-bold leading-tight mt-6 mb-6">
                                Find Your Next
                                <br />
                                <span className="text-yellow-300">Favorite Book</span>
                            </h1>

                            <p className="text-lg text-gray-200 max-w-lg mb-8">
                                Explore thousands of books across genres, discover
                                bestselling authors, and build your personal library
                                with BookSphere.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() =>
                                        document
                                            .getElementById("categories")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    className="border-2 border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-700 transition"
                                >
                                    Explore Categories
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 mt-10 flex-wrap">
                                <div>
                                    <h3 className="text-2xl font-bold">10K+</h3>
                                    <p className="text-gray-300 text-sm">Books Available</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">5K+</h3>
                                    <p className="text-gray-300 text-sm">Happy Readers</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">100+</h3>
                                    <p className="text-gray-300 text-sm">Categories</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <div id="categories" className="max-w-6xl mx-auto py-16 px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-900 mb-2">Shop by Categories</h2>
                    <p className="text-slate-600">Find the perfect book for any mood</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center border border-slate-200"
                        >
                            <div className="text-5xl mb-3">{cat.icon}</div>
                            <h3 className="font-bold text-slate-900 mb-1">{cat.name}</h3>
                            <p className="text-sm text-slate-600">{cat.count}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Best Sellers Section */}
            <div className="bg-white py-16 px-6">
                <div className="max-w-6xl mx-auto">

                    {/* Title row */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900">Best Sellers</h2>
                            <p className="text-slate-600 mt-1">Most loved books by our readers</p>
                        </div>
                        <button
                            onClick={() => navigate("/books")}
                            className="text-blue-600 font-semibold hover:text-blue-700 mt-1"
                        >
                            View ALL →
                        </button>
                    </div>

                    {/* Search bar — full width below title */}
                    <div className="relative mb-8">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                            🔍
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title or author..."
                            className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-3 text-sm bg-slate-50 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Result count */}
                    {search && (
                        <p className="text-sm text-slate-400 mb-4">
                            {bestsellers.length} result{bestsellers.length !== 1 ? "s" : ""} for "{search}"
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {renderBooks(bestsellers, "books")}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-slate-100 py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-5xl mb-3">{feature.icon}</div>
                                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* New Arrivals Carousel */}
            <div className="max-w-6xl mx-auto py-16 px-6">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900">New Arrivals</h2>
                        <p className="text-slate-600 mt-1">Latest additions to our collection</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : newArrivals.length === 0 ? (
                    <p className="text-center text-slate-500">No new arrivals yet.</p>
                ) : (
                    <div className="relative">
                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {visibleArrivals.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>

                        {/* Prev / Next Buttons */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={prevSlide}
                                disabled={carouselIndex === 0}
                                className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition"
                            >
                                ← Prev
                            </button>

                            {/* Dots */}
                            <div className="flex items-center gap-2">
                                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCarouselIndex(i)}
                                        className={`w-2.5 h-2.5 rounded-full transition ${
                                            carouselIndex === i ? "bg-amber-500" : "bg-slate-300"
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextSlide}
                                disabled={carouselIndex >= maxIndex}
                                className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
