import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";
import img1 from "../../images/bg02.jpg";

const EditBooking = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [booking, setBooking] = useState({
    Booking_Date: "",
    Customer_Name: "",
    Vehicle_Type: "",
    Vehicle_Number: "",
    Contact_Number: "",
    Email: "",
    selectedPackage: "",
    selectedServices: [],
  });

  const [promotion, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState(null);

  // Fetch booking details by ID
  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8077/Booking/${id}`);
        const data = response.data;
        setBooking({
          ...data,
          Booking_Date: new Date(data.Booking_Date).toISOString().split("T")[0], // Ensure correct date format
        });
        setSelectedServices(data.selectedServices);
      } catch (error) {
        console.error("Error fetching the booking details!", error);
        setError("Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  // Fetch packages (promotions)
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get("http://localhost:8077/Promotion");
        setPackages(response.data);
      } catch (error) {
        setError("Failed to fetch promotions.");
        console.error("Error fetching promotions", error);
      }
    };
    fetchPromotions();
  }, []);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8077/service");
        setServices(response.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prevBooking) => ({
      ...prevBooking,
      [name]: value,
    }));
  };

  const handlePackageChange = (e) => {
    setBooking((prevBooking) => ({
      ...prevBooking,
      selectedPackage: e.target.value,
    }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedServices((selectedServices) => [...selectedServices, value]);
    } else {
      setSelectedServices((selectedServices) =>
        selectedServices.filter((service) => service !== value)
      );
    }
  };