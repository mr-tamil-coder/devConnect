import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../data/main";
import { addUser } from "../utils/userSlice";
import axios from "axios";
const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const fetchUser = async () => {
    try {
      console.log("UserData is ",userData);
      
      if (userData) return;
      const response = await axios.get(API + "/profile", {
        withCredentials: true,
      });
      dispatch(addUser(response.data));
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        console.error("catch blocked ", err);
      }
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Body;
