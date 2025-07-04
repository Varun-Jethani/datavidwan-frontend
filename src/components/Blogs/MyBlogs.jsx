import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../store/blogsSlice";
import axios from "axios";

const MyBlogs = () => {
  const dispatch = useDispatch();
  const { items: allBlogs, loading } = useSelector((state) => state.blogs);
  const [myBlogs, setMyBlogs] = useState([]);
  console.log("My Blogs:", myBlogs);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(() => {
    // Fetch only the current user's blogs from the backend
    const fetchMyBlogs = async () => {
      try {
        const response = await axios.get("/blog/user", {
          withCredentials: true,
        });
        setMyBlogs(
          Array.isArray(response.data?.data) ? response.data.data : []
        );
      } catch (error) {
        console.error("Error fetching my blogs:", error);
        setMyBlogs([]);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await axios.delete(`/blog/user/${blogId}`, {
          withCredentials: true,
        });
        if (response.status !== 200 && response.status !== 204) {
          const msg =
            response.data?.message || `HTTP error! status: ${response.status}`;
          alert(msg);
          return;
        }
        setMyBlogs(myBlogs.filter((blog) => blog._id !== blogId));
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete blog post. Please try again."
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Blog Posts</h1>
            <Link
              to="/createblog"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Blog
            </Link>
          </div>

          {myBlogs.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <h2 className="text-2xl font-medium text-gray-700 mb-4">
                You haven't published any blogs yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start sharing your thoughts and knowledge by creating your first
                blog post.
              </p>
              <Link
                to="/createblog"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Blog
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Blog Post
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={blog.images[0]}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {blog.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8">
            <Link to="/blogs" className="text-blue-600 hover:text-blue-800">
              &larr; Back to all blogs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;
