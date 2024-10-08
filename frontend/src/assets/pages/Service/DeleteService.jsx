import React,{useState} from 'react'
import Spinner from '../../components/Spinner';
import axios from 'axios'
import {Link,useNavigate, useParams} from 'react-router-dom';

const DeleteService = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleDelete = () => {
    setLoading(true);
    axios.delete(`http://localhost:8077/Service/${id}`)

   .then(() => {
        setLoading(false);
        navigate('/Service');
      })
    .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <div className='p-4'>
    <h1 className='text-2xl font-bold'>Delete Service</h1>
    <p>Are you sure you want to delete this Service?</p>
    <div className='flex justify-between items-center'>
      <button onClick={handleDelete} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      <Link to={'/Service'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        Cancel
      </Link>
    </div>
  </div>
  );
  
};

export default DeleteService;