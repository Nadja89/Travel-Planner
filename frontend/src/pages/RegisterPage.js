import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../photos/login.webp";
import "../styles/Login.css";

function RegisterPage() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    imePrezime: "",
    email: "",
    korisnickoIme: "",
    lozinka: "",
    telefon: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {

        alert("Uspešno ste registrovani!");

        navigate("/");

      } else {

        alert("Greška pri registraciji.");

      }

    } catch (error) {

      console.error("Error:", error);
      alert("Server trenutno nije dostupan.");

    }
  };

  return (
    <div className="login-container page-transition">

      <div className="login-card">

        <div className="login-image">
          <img src={loginImage} alt="travel"/>
        </div>

        <div className="login-form">

          <h2>Register</h2>

          <form onSubmit={handleRegister}>

            <input
              type="text"
              placeholder="Full name"
              name="imePrezime"
              value={form.imePrezime}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              placeholder="Username"
              name="korisnickoIme"
              value={form.korisnickoIme}
              onChange={handleChange}
              required
            />

            <div className="password-field">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="lozinka"
                value={form.lozinka}
                onChange={handleChange}
                required
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>

            </div>

            <input
              type="text"
              placeholder="Phone (optional)"
              name="telefon"
              value={form.telefon}
              onChange={handleChange}
            />

            <button type="submit">Register</button>

          </form>

          <p>
            Already have an account?
            <span onClick={() => navigate("/")}> Login</span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;