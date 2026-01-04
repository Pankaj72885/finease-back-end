import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export const createBlog = async (blogData) => {
  const db = getDB();
  const result = await db.collection("blogs").insertOne({
    ...blogData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
};

export const getAllBlogs = async (filter = {}, limit = 20) => {
  const db = getDB();
  return await db
    .collection("blogs")
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
};

export const getBlogById = async (id) => {
  const db = getDB();
  return await db.collection("blogs").findOne({ _id: new ObjectId(id) });
};

export const updateBlog = async (id, userEmail, updateData) => {
  const db = getDB();
  const { _id, ...data } = updateData;
  // Only update fields provided
  return await db
    .collection("blogs")
    .updateOne(
      { _id: new ObjectId(id), "author.email": userEmail },
      { $set: { ...data, updatedAt: new Date() } }
    );
};

export const deleteBlog = async (id, userEmail) => {
  const db = getDB();
  return await db.collection("blogs").deleteOne({
    _id: new ObjectId(id),
    "author.email": userEmail,
  });
};
