import api from "./api";

export const getBooks = async () => {
  const res = await api.get("/books");
  return res.data;
};

// Add book — sends FormData if an image file is included, plain JSON otherwise
export const addBook = async (data, imageFile) => {
  if (imageFile) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("price", data.price);
    formData.append("description", data.description || "");
    formData.append("image", imageFile); // actual file → Cloudinary

    const res = await api.post("/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  // No file — send plain JSON with image URL
  const res = await api.post("/books", data);
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await api.delete(`/books/${id}`);
  return res.data;
};
