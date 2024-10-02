import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct

const ReadOneBooking = () => {
  const { id } = useParams(); // Get the booking ID from the URL
  const [booking, setBooking] = useState(null);
  const [typewriterText, setTypewriterText] = useState(""); // State for typewriter effect

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:8077/Booking/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("There was an error fetching the booking!", error);
      }
    };

    fetchBooking();
  }, [id]);