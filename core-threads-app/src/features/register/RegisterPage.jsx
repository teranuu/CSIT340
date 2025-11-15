import RegisterSection from "./components/RegisterSection.jsx";
import { UserAuthNavbar } from "../../components/UserAuthNavbar/index.js";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...postData } = formData;

    try {
      const response = await fetch(
        "http://localhost:8080/api/customers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        console.error("Registration failed:", data.message);
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };

  const redirectLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <>
      <UserAuthNavbar />
      <RegisterSection onRegister={handleRegister} onLogin={redirectLogin} />
    </>
  );
}

export default RegisterPage;
