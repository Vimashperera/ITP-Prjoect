import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import backgroundImage from '../../images/mee.jpg';
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'

const ReadOneApplicant = () => {
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typewriterText, setTypewriterText] = useState(""); // State for typewriter effect
  const { id } = useParams();
  const [interviewdate, setinterviewdate] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8077/applicant/${id}`)
      .then((response) => {
        setApplicant(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const handleReply = () => {
    if (applicant && applicant.Email) {
      const email = applicant.Email;
      const subject = 'Reply to your Application';
      const jobType = applicant.JobType || 'the position';  // Fallback in case JobType is unavailable


      const body = `Dear Customer,
  
  Thank you for your application for ${jobType}.
  
  We received your application. Your interview date is ${interviewdate}.
  
  Best regards,
  Wasana Service Center`;

      // Open Gmail with pre-filled fields using mailto
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      console.log("Email not available.");
    }
  };

  useEffect(() => {
    const words = ["Show Applicant"];
    let i = 0;
    let j = 0;
    let currentWord = "";
    let isDeleting = false;

    function type() {
      currentWord = words[i];
      if (isDeleting) {
        setTypewriterText(currentWord.substring(0, j - 1));
        j--;
        if (j === 0) {
          isDeleting = false;
          i++;
          if (i === words.length) {
            i = 0;
          }
        }
      } else {
        setTypewriterText(currentWord.substring(0, j + 1));
        j++;
        if (j === currentWord.length) {
          isDeleting = true;
        }
      }
      setTimeout(type, 300);
    }

    type();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!applicant) {
    return <p>Data is loading...</p>;
  }

  return (
    <div className=''><Navbar />
      <div
        className="flex flex-col items-center min-h-screen p-4 bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <BackButton destination={`/applicant/`} />
        <div className="flex items-center justify-center w-full h-full mb-6">
          <h1 className="text-4xl font-bold text-white">{typewriterText}</h1>
        </div>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg hover:shadow-red-800">
          {applicant.image && (
            <p>
              CV:{' '}
              <a href={applicant.image} target="_blank" rel="noopener noreferrer">
                <strong>View cv:</strong>
              </a>
            </p>
          )}
          <div className="px-6 py-6 space-y-4 bg-white rounded-lg shadow-lg">
            <div className="pb-2 text-2xl font-bold text-gray-800 border-b border-gray-200">Applicant Details</div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
                <span>Applicant ID:</span>
                <span className="font-medium text-gray-900">{applicant._id}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
                <span>First Name:</span>
                <span className="font-medium text-gray-900">{applicant.FirstName}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
                <span>Last Name:</span>
                <span className="font-medium text-gray-900">{applicant.LastName}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
                <span>Phone Number:</span>
                <span className="font-medium text-gray-900">{applicant.Number}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
                <span>Email:</span>
                <span className="font-medium text-gray-900">{applicant.Email}</span>
              </div>

              <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
                <span>Job Type:</span>
                <span className="font-medium text-gray-900">{applicant.JobType}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
              <label htmlFor="interviewDate">Interview Date:</label>
              <input
                id="interviewDate"
                type="datetime-local"
                placeholder="interview date"
                value={interviewdate}
                onChange={(e) => setinterviewdate(e.target.value)}
                className="p-2 font-medium text-gray-900 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleReply}
              className="px-4 py-2 mt-6 font-bold text-white bg-green-500 rounded shadow hover:bg-green-600"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReadOneApplicant;
