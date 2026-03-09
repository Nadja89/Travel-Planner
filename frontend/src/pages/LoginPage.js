import { useNavigate } from "react-router-dom";
import { useState } from "react";
import loginImage from "../photos/login.webp";
import "../styles/Login.css";

function LoginPage() {

  const navigate = useNavigate();

  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          korisnickoIme,
          lozinka
        })
      });

      const data = await response.json();

      if (response.ok && data) {

        // Čuvamo korisnika u browseru
        localStorage.setItem("user", JSON.stringify(data));

        alert("Uspešno ste prijavljeni!");

        navigate("/home");

      } else {

        alert("Pogrešno korisničko ime ili lozinka.");

      }

    } catch (error) {

      console.error(error);
      alert("Greška pri prijavi.");

    }
  };

  return (
    <div className="login-container page-transition">

      <div className="login-card">

        <div className="login-image">
          <img src={loginImage} alt="travel" />
        </div>

        <div className="login-form">

          <h1>Travel Planner</h1>
          <h2>Login</h2>

          <form onSubmit={handleLogin}>

            <input
              type="text"
              placeholder="Username"
              value={korisnickoIme}
              onChange={(e) => setKorisnickoIme(e.target.value)}
            />

            <div className="password-field">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>

            </div>

            <button type="submit">Login</button>

          </form>

          <p>
            Don't have an account?
            <span onClick={() => navigate("/register")}> Register</span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;