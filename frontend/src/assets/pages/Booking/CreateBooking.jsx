import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import img1 from "../../images/bg02.jpg";
import Swal from "sweetalert2";
import Navbar1 from "../Navbar/NavBar1";
import Footer from "../footer/Footer";

const CreateBooking = () => {
  const navigate = useNavigate();
  const { cusID } = useParams();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get("http://localhost:8077/Promotion");
        setPackages(response.data); // Assuming promotion data contains packages
        console.log(response.selectedServices);
      } catch (error) {
        setError("Failed to fetch promotions.");
        console.error("Error fetching promotions", error);
      }
    };
    fetchPromotions();
  }, []);
   // Fetch services from API
   useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8077/service")
      .then((response) => {
        setServices(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (cusID) {
      fetchData();
    }
  }, [cusID]);

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

  const validateForm = () => {
    const { Booking_Date, Customer_Name, Contact_Number, Vehicle_Number } =
      booking;

    const today = new Date().toISOString().split("T")[0];
    const vehicleNumberPattern = /^[A-Z]{2,3}-\d{4}$/;
    const customerNamePattern = /^[A-Za-z\s]+$/;
    const contactNumberPattern = /^0\d{9}$/;

    if (Booking_Date < today) {
      Swal.fire(
        "Error",
        "Booking date must be today or a future date.",
        "error"
      );
      return false;
    }

    if (!customerNamePattern.test(Customer_Name)) {
      Swal.fire(
        "Error",
        "Customer name cannot contain numbers or special characters.",
        "error"
      );
      return false;
    }

    if (!contactNumberPattern.test(Contact_Number)) {
      Swal.fire(
        "Error",
        "Contact number must be a 10-digit number starting with 0.",
        "error"
      );
      return false;
    }

    if (!vehicleNumberPattern.test(Vehicle_Number)) {
      Swal.fire(
        "Error",
        "Vehicle number must start with 1-3 letters followed by 4 digits.",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestBody = {
        ...booking,
        selectedServices,
      };
      await axios.post("http://localhost:8077/Booking", requestBody);

      const reqbody = {
        ...booking,
        selectedServices,
      };
      await axios.post("http://localhost:8077/Booking", reqbody);

      Swal.fire("Success", "Booking created successfully!", "success");
      navigate(`/ReadOneHome/${cusID}`);

      console.log(selectedServices);
      console.log(requestBody); // Redirect to the bookings list after creation
    } catch (error) {
      console.error("There was an error creating the booking!", error);
      Swal.fire(
        "Error",
        "Failed to create booking. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };


