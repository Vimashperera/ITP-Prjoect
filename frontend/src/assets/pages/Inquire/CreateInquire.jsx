import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {  Link } from 'react-router-dom';
import Swal from "sweetalert2";
import img1 from '../../images/bg02.jpg';
import Navbar from '../Navbar/NavBar1'
import Footer from '../footer/Footer';

const CreateInquire = () => {
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Number, setNumber] = useState("");
    const [ServiceType, setServiceType] = useState("");
    const [Message, setMessage] = useState("");
    const [VehicleNumber, setVehicleNumber] = useState("");
    const { cusID } = useParams(); // Get customer ID from URL params
  
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const validateForm = () => {
       
        const namePattern = /^[a-zA-Z\s]*$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^[0][0-9]{9}$/;
      
        // Validate Name: no numbers or special characters allowed
        if (!namePattern.test(Name)) {
          Swal.fire({
            icon: "error",
            title: "Invalid Name",
            text: "Name can't contain numbers or special characters.",
          });
          return false;
        }
      
        // Validate Email: must contain @, domain, and .com or other valid domain extensions
        if (!emailPattern.test(Email)) {
          Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address with @ and a valid domain.",
          });
          return false;
        }
      
        // Validate Phone Number: must be a 10-digit number starting with 0
        if (!phonePattern.test(Number)) {
          Swal.fire({
            icon: "error",
            title: "Invalid Phone Number",
            text: "Phone number should be a 10-digit number starting with 0.",
          });
          return false;
        }
      
        // If all validations pass
        return true;
      };
      

};

export default CreateInquire;