import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ShowAllBooking from "./assets/pages/Booking/ShowAllBooking";
import CreateBooking from "./assets/pages/Booking/CreateBooking";
import EditBooking from "./assets/pages/Booking/EditBooking";
import ReadOneBooking from "./assets/pages/Booking/ReadoneBooking";

import { CreateVehicle } from "./assets/pages/Vehicle/Createvehicle";
import ShowAllvehicle from "./assets/pages/Vehicle/ShowAllvehicle";
import EditVehicle from "./assets/pages/Vehicle/EditVehicle";
import ReadOneVehicle from "./assets/pages/Vehicle/ReadoneVehicle";
import DeleteVehicle from "./assets/pages/Vehicle/DeleteVehicle";

import CreateServiceHistory from "./assets/pages/ServiceHistory/CreateServiceHistory";
import EditShowHistory from "./assets/pages/ServiceHistory/EditShowHistory";
import DeleteShowHistory from "./assets/pages/ServiceHistory/DeleteShowHistory";
import ReadoneShowHistory from "./assets/pages/ServiceHistory/ReadoneShowHistory";
import ShowAllServiceHistory from "./assets/pages/ServiceHistory/ShowAllServiceHistory";

const App = () => {

  return (
    <Routes>
      <Route path="/ServiceHistory/create" element={<CreateServiceHistory />} />
      <Route path="/ServiceHistory/edit/:id" element={<EditShowHistory />} />
      <Route
        path="/ServiceHistory/delete/:id"
        element={<DeleteShowHistory />}
      />
      <Route path="/ServiceHistory/:id" element={<ReadoneShowHistory />} />
      <Route path="/ServiceHistory" element={<ShowAllServiceHistory />} />


      <Route path="/vehicles" element={<ShowAllvehicle />} />
      <Route path="/vehicles/edit/:id" element={<EditVehicle />} />
      <Route path="/vehicles/:id" element={<ReadOneVehicle />} />
      <Route path="/vehicles/delete/:id" element={<DeleteVehicle />} />
      <Route path="/vehicles/create" element={<CreateVehicle />} />


    </Routes>
  );
};
  return(
    <div> ITP Project   </div>
  )
}


export default App