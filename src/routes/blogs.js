import express from "express";
import verifyToken from "../middleware/auth.js";
import * as BlogModel from "../models/Blog.js";

const router = express.Router();

// GET /api/blogs - Get all blogs
router.get("/", async (req, res) => {
  try {
    // Optional query params for filtering
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const blogs = await BlogModel.getAllBlogs(filter);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/blogs/user/me - Get my blogs (Private)
router.get("/user/me", verifyToken, async (req, res) => {
  try {
    // Reuse getAllBlogs with filter
    const blogs = await BlogModel.getAllBlogs({
      "author.email": req.user.email,
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/blogs/:id - Get single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await BlogModel.getBlogById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/blogs - Create blog
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content, coverImage, tags, category, excerpt } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and Content are required" });
    }

    const author = {
      name: req.user.name || req.user.email.split("@")[0],
      email: req.user.email,
      photo: req.user.picture || "",
      uid: req.user.uid,
    };

    const newBlog = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      coverImage:
        coverImage ||
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000",
      category: category || "General",
      tags: tags || [],
      author,
      likes: 0,
      readTime: Math.ceil(content.split(" ").length / 200) + " min read",
    };

    const result = await BlogModel.createBlog(newBlog);
    res.status(201).json({ _id: result.insertedId, ...newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/blogs/:id - Update blog
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const result = await BlogModel.updateBlog(
      req.params.id,
      req.user.email,
      req.body
    );

    if (result.matchedCount === 0) {
      return res
        .status(403)
        .json({
          message:
            "Unable to update. Blog not found or you are not the author.",
        });
    }

    res.json({ message: "Blog updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/blogs/:id - Delete blog
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const result = await BlogModel.deleteBlog(req.params.id, req.user.email);

    if (result.deletedCount === 0) {
      return res
        .status(403)
        .json({
          message:
            "Unable to delete. Blog not found or you are not the author.",
        });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
