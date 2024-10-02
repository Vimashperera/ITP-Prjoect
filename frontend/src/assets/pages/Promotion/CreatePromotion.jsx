import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import img1 from '../../images/bg02.jpg';
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const CreatePromotion = () => {
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    discount: '',
    includes: [],
    startDate: "",
    endDate: "",
    Percentage: 0, // Ensure to include the percentage in the promotion object
  });
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [percentage, setPercentage] = useState(0); // Main percentage field
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch services from API
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8077/service')
      .then((response) => {
        setServices(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: value,
    }));
  };


  // Select or deselect services and calculate discount
  const handleServiceSelect = (serviceName, servicePrice) => {
    let updatedSelectedServices = [];

    if (selectedServices.some(service => service.name === serviceName)) {
      updatedSelectedServices = selectedServices.filter(service => service.name !== serviceName);
    } else {
      updatedSelectedServices = [...selectedServices, { name: serviceName, price: servicePrice }];
    }

    setSelectedServices(updatedSelectedServices);

    // Calculate the total price of selected services
    const totalPrice = updatedSelectedServices.reduce((sum, service) => sum + service.price, 0);
    setTotalAmount(totalPrice); // Store total amount before discount

    // Calculate discount based on total price and percentage
    const discountedPrice = totalPrice - (totalPrice * (percentage / 100));

    // Auto-fill the discount field with the discounted price
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      discount: discountedPrice.toFixed(2), // Limit to 2 decimal places
    }));
  };

  // Handle percentage change and recalculate discount
  const handlePercentageChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPercentage(value);

    // Recalculate discount based on the new percentage
    const discountedPrice = totalAmount - (totalAmount * (value / 100));
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      Percentage: value, // Save the percentage to the promotion object
      discount: discountedPrice.toFixed(2),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8077/Promotion', { 
        ...promotion, 
        includes: selectedServices.map(s => s.name),
        Percentage: percentage // Ensure the percentage is included in the request
      });
      alert("Promotion created successfully!");
      setPromotion({
        title: "",
        description: "",
        discount: '',
        includes: [],
        startDate: "",
        endDate: "",
        Percentage: 0,
      });
      setSelectedServices([]);
      setTotalAmount(0);
      setPercentage(0);
      navigate('/Promotion');
    } catch (error) {
      console.error("There was an error creating the promotion!", error);
      alert("Failed to create promotion. Please try again.");
    }
  };

}
