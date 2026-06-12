import dotenv from "dotenv";
import mongoose from "mongoose";
import Book from "./models/Book.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bookstore";

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 199,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    description: "A classic novel of the Jazz Age.",
  },
  {
    title: "1984",
    author: "George Orwell",
    price: 249,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
    description: "Dystopian social science fiction novel and cautionary tale.",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 299,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    description: "A novel about racial injustice in the Deep South.",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 179,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
    description: "A romantic novel of manners.",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 349,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    description: "Fantasy novel and prelude to The Lord of the Rings.",
  },
  {
    title: "Moby Dick",
    author: "Herman Melville",
    price: 219,
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80",
    description: "The saga of Captain Ahab's obsessive quest.",
  }
];

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    await Book.deleteMany({});
    const inserted = await Book.insertMany(sampleBooks);
    console.log(`Inserted ${inserted.length} books`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

run();
