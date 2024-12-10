import React, { useState, useEffect } from "react";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Fetch user ID and user details
    const fetchUserDetails = async () => {
      try {
        //const response = await fetch("http://localhost:5000/auth/check", {
          const response = await fetch("https://crazycar-kxb4.onrender.com/auth/check", {  
          credentials: "include", // Send cookies along with the request\
        });
        if (response.ok) {
          const data = await response.json();
          console.log("User ID:", data.userId); // Print userId to console
          // Fetch user details using the userId
          const userDetailsResponse = await fetch(
            `http://localhost:5000/users/${data.userId}`
          );
          if (userDetailsResponse.ok) {
            const userDetails = await userDetailsResponse.json();
            setUser(userDetails);
            setFormData(userDetails);
          } else {
            console.error("Failed to fetch user details");
          }
        } else {
          console.error("Failed to authenticate");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const saveChanges = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Profile updated successfully!");
        setUser(formData);
        setEditMode(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const updatePassword = () => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      alert("Password updated successfully!");
      setPasswordModal(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } else {
      alert("Passwords do not match!");
    }
  };

  const styles = {
    container: {
      display: "flex",
      fontFamily: "'Roboto', sans-serif",
      color: "#333",
      padding: "50px",
    },
    sidebar: {
      width: "25%",
      padding: "25px",
      backgroundColor: "#343a40",
      color: "white",
      textAlign: "center",
      borderRadius: "10px",
      border: "1px solid black",
    },
    avatar: {
      borderRadius: "50%",
      marginBottom: "10px",
      width: "100px",
      height: "100px",
      border: "2px solid #fff",
    },
    button: {
      display: "block",
      margin: "10px 0",
      padding: "10px",
      width: "100%",
      border: "none",
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "5px",
      cursor: "pointer",
    },
    content: {
      width: "75%",
      padding: "20px",
    },
    profileCard: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    label: {
      display: "block",
      margin: "10px 0 5px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <img
          src="https://via.placeholder.com/100"
          alt="User Avatar"
          style={styles.avatar}
        />
        <h3>{user.name}</h3>
        <button style={styles.button} onClick={() => setEditMode(false)}>
          User Profile
        </button>
        <button style={styles.button} onClick={() => setEditMode(true)}>
          Update Profile
        </button>
        <button style={styles.button} onClick={() => setPasswordModal(true)}>
          Change Password
        </button>
        <button style={styles.button}>Log Out</button>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {!editMode ? (
          <div style={styles.profileCard}>
            <h2>User Profile</h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Mobile:</strong> {user.mobile}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
            <p>
              <strong>Date of Birth:</strong> {user.dob}
            </p>
            <p>
              <strong>Address:</strong> {user.address}
            </p>
          </div>
        ) : (
          <div style={styles.profileCard}>
            <h2>Update Profile</h2>
            <form>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={styles.input}
              />
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
              />
              <label style={styles.label}>Mobile:</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                style={styles.input}
              />
              <label style={styles.label}>Address:</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                style={styles.textarea}
              />
              <button
                type="button"
                onClick={saveChanges}
                style={styles.button}
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
