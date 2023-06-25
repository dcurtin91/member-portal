import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
//import { updateMessage } from "./firebase";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(" ");
  const [phone, setPhone] = useState(" ");
  const [vacancy, setVacancy] = useState(" ");
  const [availability, setAvailability] = useState(" ");
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingVacancy, setisEditingVacancy] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const fetchUserData = async () => {
    try {
      const docId = user.uid;
      const docRef = await getDoc(doc(db, "properties", docId));

      if (docRef.exists()) {
        const data = docRef.data();
        setAddress(data.address);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setVacancy(data.vacancy);
        setAvailability(data.availability);
      } else {
        // Handle the case where the document doesn't exist
        console.log("User data not found.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleVacancyChange = (event) => {
    setVacancy(event.target.value);
  };

  const handleAvailabilityChange = (event) => {
    setAvailability(event.target.value);
  };

  const handleAddressEdit = () => {
    setIsEditingAddress(true);
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleEmailEdit = () => {
    setIsEditingEmail(true);
  };

  const handlePhoneEdit = () => {
    setIsEditingPhone(true);
  };

  const handleVacancyEdit = () => {
    setisEditingVacancy(true);
  };

  const handleAvailabilityEdit = () => {
    setIsEditingAvailability(true);
  };

  const handleUpdate = async () => {
    try {
      const docId = user.uid;
      const docRef = doc(db, "properties", docId);

      // Update the document in Firestore with the new data
      await updateDoc(docRef, {
        address: address,
        name: name,
        email: email,
        phone: phone,
        vacancy: vacancy,
        availability: availability,
      });

      // Fetch the updated user data and set it in the state variables
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();
      setAddress(updatedData.address);
      setName(updatedData.name);
      setEmail(updatedData.email);
      setPhone(updatedData.phone);
      setVacancy(updatedData.vacancy);
      setAvailability(updatedData.availability);

      setIsEditingName(false);
      setIsEditingEmail(false);
      setisEditingVacancy(false);
      setIsEditingAvailability(false);
      setIsEditingAddress(false);
      setIsEditingPhone(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserData();
  }, [user, loading]);

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <h2>Your Property Address and Contact Info</h2>
        <div>
          {isEditingAddress ? (
            <input type="text" value={address} onChange={handleAddressChange} />
          ) : (
            <>
              {address}{" "}
              <span className="edit-icon" onClick={handleAddressEdit}>
                &#x270E;
              </span>
            </>
          )}
        </div>
        <div>
          {isEditingName ? (
            <input type="text" value={name} onChange={handleNameChange} />
          ) : (
            <>
              {name}{" "}
              <span className="edit-icon" onClick={handleNameEdit}>
                &#x270E;
              </span>
            </>
          )}
        </div>
        <div>
          {isEditingEmail ? (
            <input type="text" value={email} onChange={handleEmailChange} />
          ) : (
            <>
              {email}{" "}
              <span className="edit-icon" onClick={handleEmailEdit}>
                &#x270E;
              </span>
            </>
          )}
        </div>
        <div>
          {isEditingPhone ? (
            <input type="tel" value={phone} onChange={handlePhoneChange} />
          ) : (
            <>
              {phone}{" "}
              <span className="edit-icon" onClick={handlePhoneEdit}>
                &#x270E;
              </span>
            </>
          )}
        </div>
        <div>
          Vacancy:{" "}
          {isEditingVacancy ? (
            <select value={vacancy} onChange={handleVacancyChange}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          ) : (
            <>
              {vacancy}{" "}
              <span className="edit-icon" onClick={handleVacancyEdit}>
                &#x270E;
              </span>
            </>
          )}
        </div>
        {vacancy === "Yes" && (
          <div>
            Number of vacant rooms:{" "}
            {isEditingAvailability ? (
              <input
                type="number"
                value={availability}
                onChange={handleAvailabilityChange}
                min={0}
                max={10}
              />
            ) : (
              <>
                {availability}{" "}
                <span className="edit-icon" onClick={handleAvailabilityEdit}>
                  &#x270E;
                </span>
              </>
            )}
          </div>
        )}
        <button className="dashboard__btn" onClick={handleUpdate}>
          Update
        </button>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;