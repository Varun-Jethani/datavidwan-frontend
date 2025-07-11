import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import AboutUs from "./components/AboutUs";
import Navbar from "./components/Navbar/Navbar";
import CourseDetails from "./components/courses/CourseDetails"; // Import a placeholder component for courses
import ServiceDetails from "./components/Services/ServiceDetails"; // Import a placeholder component for services
import Service from "./components/Services/Service";
import Gallery from "./components/Gallery";
import ContactPage from "./components/ContactPage";
import Blog from "./components/Blogs/Blog";
import ViewBlog from "./components/Blogs/ViewBlog";
import MyBlogs from "./components/Blogs/MyBlogs";
import CreateBlog from "./components/Blogs/CreateBlog";
import axios from "axios";
import AuthPage from "./components/auth/Auth";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "./store/userSlice";
import Courses from "./components/courses/Courses";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  axios.defaults.baseURL = API_BASE_URL;
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  axios.defaults.withCredentials = true;
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Service />} />
        <Route path="/services/:service" element={<ServiceDetails />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:course" element={<CourseDetails />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/view" element={<Blog />} />
        <Route path="/blog/:blogId" element={<ViewBlog />} />
        <Route path="/blogs/my" element={<MyBlogs />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
