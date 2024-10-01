import React, { useState, useEffect } from 'react';
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import Swal from 'sweetalert2';
import CountUp from 'react-countup'; // Added import for CountUp
import jsPDF from 'jspdf'; // Added import for jsPDF
import 'jspdf-autotable'; // Added import for jsPDF autotable
import logo from '../../images/logo.png';

const ShowBooking = () => {
    // State initialization
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(false); // Added darkMode state
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // Added searchQuery state
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    
    // Styles for even and odd rows
    const styles = {
        tableRowEven: {
            backgroundColor: '#f9f9f9',
        },
        tableRowOdd: {
            backgroundColor: '#ffffff',
        },
        image: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
        },
        actionIcons: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Initialize CountUp on mount for stats
    useEffect(() => {
        const numbers = document.querySelectorAll("[countTo]");

        numbers.forEach((number) => {
            const ID = number.getAttribute("id");
            const value = number.getAttribute("countTo");
            let countUp = new CountUp(ID, value);

            if (number.hasAttribute("data-decimal")) {
                const options = {
                    decimalPlaces: 1,
                };
                countUp = new CountUp(ID, value, options);
            }

            if (!countUp.error) {
                countUp.start();
            } else {
                console.error(countUp.error);
                number.innerHTML = value;
            }
        });
    }, []);
    
    // Initial fetch of Booking data
    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8077/Booking')
            .then((response) => {
                setBookings(response.data);
                setFilteredBookings(response.data); // Initialize filtered bookings
                setLoading(false);
            })
            .catch((error) => {
                console.error("There was an error fetching the bookings!", error);
                setLoading(false);
            });
    }, []);

    // Search functionality
   // Search functionality
const handleSearch = () => {
    const filtered = bookings.filter((booking) =>
        booking.Booking_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.Customer_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.Vehicle_Number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.Vehicle_Type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.Contact_Number.includes(searchQuery.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchQuery.toLowerCase()) ||  // Added status to the search
        booking.selectedPackage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.selectedServices.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredBookings(filtered);
};


    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

    const generateBookingPDF = (bookings) => {
        const doc = new jsPDF(); // Initialize jsPDF document
        const tableColumn = [
            "Booking ID", "Booking Date", "Customer Name", "Vehicle Type", "Vehicle Number",
            "Contact Number", "Email", "Selected Package", "Selected Services", "Status"
        ]; // Define the columns for the PDF table
        const tableRows = [];
    
        // Loop through bookings and format the rows for the PDF
        bookings.forEach((booking) => {
            const data = [
                booking.Booking_Id,
                new Date(booking.Booking_Date).toLocaleDateString(),
                booking.Customer_Name,
                booking.Vehicle_Type,
                booking.Vehicle_Number,
                booking.Contact_Number,
                booking.Email,
                booking.selectedPackage,
                booking.selectedServices.join(", "), // Join services into a single string
                booking.status // Add booking status
            ];
            tableRows.push(data); // Add each booking's data as a row
        });
    
        const date = Date().split(" ");
        const dateStr = date[1] + "-" + date[2] + "-" + date[3]; // Format the current date
    
        // Add the report title with consistent font and color
        doc.setFontSize(28).setFont("Mooli", "bold").setTextColor('red');
        doc.text("Wasana Auto Service", 60, 15); // Set the main title
    
        // Add the report subtitle
        doc.setFont("helvetica", "normal").setFontSize(20).setTextColor(0, 0, 0);
        doc.text("Booking Report", 65, 25); // Adjusted positioning for the subtitle
    
        // Add the report generation date
        doc.setFont("times", "normal").setFontSize(15).setTextColor(100, 100, 100);
        doc.text(`Report Generated Date: ${dateStr}`, 65, 35); // Adjusted positioning for the date
    
        // Add the company address or relevant info
        doc.setFont("courier", "normal").setFontSize(12).setTextColor(150, 150, 150);
        doc.text("Wasana Auto Service, Colombo 4", 30, 45); // Company information
    
        // Add a separator line for better visual structure
        doc.setFont("courier", "normal").setFontSize(12).setTextColor(150, 150, 150);
        doc.text(
            "--------------------------------------------------------------------------------------------------",
            0,
            50
        );
    
        // Add the table for booking details with adjusted margins
        doc.autoTable({
            startY: 55, // Start the table after the header content
            margin: { left: 20, right: 20 }, // Add side margins for the table
            head: [tableColumn], // Table column headers
            body: tableRows, // Table rows (booking data)
            styles: { fontSize: 9 }, // General table font size
            headStyles: {
                fillColor: [31, 41, 55], // Header background color
                textColor: [255, 255, 255], // Header text color
                fontStyle: "bold", // Bold header
            },
        });
    
        // Save the generated PDF with the formatted date in the filename
        doc.save(`Booking-Report_${dateStr}.pdf`);
    };

