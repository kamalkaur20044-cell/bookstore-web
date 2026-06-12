import multer from "multer";

// Memory storage — file stays in RAM as a buffer, never written to disk
// We stream it directly to Cloudinary using upload_stream
const upload = multer({ storage: multer.memoryStorage() });

export default upload;
