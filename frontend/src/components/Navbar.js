import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar(){

const [open,setOpen] = useState(false);
const [showLogout,setShowLogout] = useState(false);

const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user"));

const initial =
user?.imePrezime?.charAt(0).toUpperCase() || "U";


const logout = () =>{

localStorage.removeItem("user");
navigate("/");

};


return(

<div className="navbar">

<div className="logo">
Travel Planner
</div>


<div className="profile">

<div
className="avatar"
onClick={()=>setOpen(!open)}
>
{initial}
</div>


{open && (

<div className="dropdown">

<div
className="dropdown-item"
onClick={()=>{
setShowLogout(true);
setOpen(false);
}}
>

Logout

</div>

</div>

)}

</div>


{showLogout && (

<div className="logout-modal">

<div className="logout-box">

<h3>Da li želite da se odjavite?</h3>

<div className="logout-buttons">

<button
className="logout-confirm"
onClick={logout}
>
Odjavi se
</button>

<button
className="logout-cancel"
onClick={()=>setShowLogout(false)}
>
Otkaži
</button>

</div>

</div>

</div>

)}

</div>

);

}

export default Navbar;