import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Card from "react-bootstrap/Card";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(" ");
  const [phone, setPhone] = useState(" ");
  const [vacancy, setVacancy] = useState(" ");
  const [availability, setAvailability] = useState(" ");
  const [photo, setPhoto] = useState(null);

  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingVacancy, setisEditingVacancy] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

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
        setPhoto(data.photo);
      } else {
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

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setPhoto(file);
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

  const handlePhotoEdit = () => {
    setIsEditingPhoto(true);
  };

  const handleUpdate = async () => {
    try {
      const docId = user.uid;
      const docRef = doc(db, "properties", docId);

      // Upload the photo to storage (assuming you have storage setup)
      if (photo) {
        const storageRef = ref(storage, `photos/${user.uid}`);
        await uploadBytes(storageRef, photo);
      }

      await updateDoc(docRef, {
        address: address,
        name: name,
        email: email,
        phone: phone,
        vacancy: vacancy,
        availability: availability,
        photo: photo
          ? getDownloadURL(ref(storage, `photos/${user.uid}`))
          : null,
      });

      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();
      setAddress(updatedData.address);
      setName(updatedData.name);
      setEmail(updatedData.email);
      setPhone(updatedData.phone);
      setVacancy(updatedData.vacancy);
      setAvailability(updatedData.availability);
      setPhoto(updatedData.photo);

      setIsEditingName(false);
      setIsEditingEmail(false);
      setisEditingVacancy(false);
      setIsEditingAvailability(false);
      setIsEditingAddress(false);
      setIsEditingPhone(false);
      setIsEditingPhoto(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/member-portal/");

    fetchUserData();
  }, [user, loading]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Card
        style={{
          border: "1px solid black",
          backgroundColor: "lightgrey",
        }}
      >
        <h2>Your Property Address & Contact Info</h2>
        <div className="dash_item">
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
        <div className="dash_item">
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
        <div className="dash_item">
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
        <div className="dash_item">
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
        <div className="dash_item">
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
          <div className="dash_item">
            Capacity:{" "}
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
        <div className="dash_item">
          {isEditingPhoto ? (
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          ) : (
            <>
              {photo ? photo.name : ""}{" "}
              <span className="edit-icon" onClick={handlePhotoEdit}>
                &#x270E;
              </span>
            </>
          )}
        </div>

        <button className="dashboard__btn" onClick={handleUpdate}>
          Update
        </button>
      </Card>
    </div>
  );
}

export default Dashboard;
