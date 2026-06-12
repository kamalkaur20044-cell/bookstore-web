import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/book/BookCard";
import { getBooks } from "../services/book.service";
import toast from "react-hot-toast";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // read search query from URL
    const query = searchParams.get("search") || "";

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const data = await getBooks();
                setBooks(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Failed to load books.");
                toast.error("Failed to load books");
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // filter locally by title or author
    const filtered = books.filter((book) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
            book.title?.toLowerCase().includes(q) ||
            book.author?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900">All Books</h1>
                <p className="text-slate-500 mt-1">
                    {query ? `Showing results for "${query}"` : "Browse our entire collection"}
                </p>
            </div>

            {/* Search bar */}
            <div className="mb-8 flex gap-2">
                <input
                    type="text"
                    defaultValue={query}
                    placeholder="Search by title or author..."
                    onChange={(e) => {
                        const val = e.target.value.trim();
                        if (val) setSearchParams({ search: val });
                        else setSearchParams({});
                    }}
                    className="w-full max-w-md border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
                />
                {query && (
                    <button
                        onClick={() => setSearchParams({})}
                        className="px-4 py-2 text-sm bg-slate-200 rounded-lg hover:bg-slate-300 transition"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">No books found{query ? ` for "${query}"` : ""}.</p>
                    {query && (
                        <button
                            onClick={() => setSearchParams({})}
                            className="mt-4 text-amber-600 font-semibold hover:underline"
                        >
                            View all books
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <p className="text-sm text-slate-400 mb-4">{filtered.length} book{filtered.length !== 1 ? "s" : ""} found</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filtered.map((book) => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
