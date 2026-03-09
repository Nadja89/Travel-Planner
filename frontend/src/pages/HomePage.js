import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

function HomePage() {

const [tripPlans,setTripPlans] = useState([]);
const [memberships,setMemberships] = useState([]);
const [showCreate,setShowCreate] = useState(false);
const [filter,setFilter] = useState("moja");

const [newTrip,setNewTrip] = useState({
naziv:"",
destinacija:"",
datumOd:"",
datumDo:"",
opis:""
});

const navigate = useNavigate();
const sliderRef = useRef(null);

const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;


const cityImages = {
"Rim":"https://images.unsplash.com/photo-1552832230-c0197dd311b5",
"Pariz":"https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
"Budimpešta":"https://images.unsplash.com/photo-1541849546-216549ae216d",
"Italija":"https://images.unsplash.com/photo-1529260830199-42c24126f198"
};

const defaultImage =
"https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

const getImage = (dest)=>{
if(!dest) return defaultImage;
const city = dest.split(",")[0].trim();
return cityImages[city] || defaultImage;
};



const formatDate = (date) => {
if(!date) return "";
return new Date(date).toLocaleDateString("sr-Latn-RS",{
day:"2-digit",
month:"long",
year:"numeric"
});
};



useEffect(()=>{

const loadTrips = async ()=>{
const res = await fetch("http://localhost:3001/trip-plans");
const data = await res.json();
setTripPlans(data);
};

const loadMemberships = async ()=>{
if(!user) return;

const res = await fetch("http://localhost:3001/trip-members");
const data = await res.json();

const mine = data.filter(m => m.userId === user.id);

setMemberships(mine);
};

loadTrips();
loadMemberships();

},[user]);




const isMember = (tripId)=>{
return memberships.some(m => m.tripPlanId === tripId);
};



const filteredTrips = tripPlans.filter(trip=>{

const creator = trip.kreatorId === user?.id;
const member = memberships.some(m => m.tripPlanId === trip.id);

if(filter === "sva") return true;
if(filter === "moja") return creator || member;
if(filter === "kreator") return creator;
if(filter === "clan") return member;
if(filter === "nisam") return !creator && !member;

return true;

});



const joinTrip = async(tripId)=>{

const res = await fetch("http://localhost:3001/trip-members",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
tripPlanId:tripId,
userId:user.id,
uloga:"clan"
})
});

if(res.ok){
window.location.reload();
}

};



const openTrip=(trip)=>{
if(trip.kreatorId===user.id || isMember(trip.id)){
navigate("/trip/"+trip.id);
}
};


const createTrip = async()=>{

const res = await fetch("http://localhost:3001/trip-plans",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
...newTrip,
kreatorId:user.id
})
});

if(res.ok){

setShowCreate(false);

setNewTrip({
naziv:"",
destinacija:"",
datumOd:"",
datumDo:"",
opis:""
});

window.location.reload();

}

};



const slideLeft=()=>{
sliderRef.current.scrollBy({left:-320,behavior:"smooth"});
};

const slideRight=()=>{
sliderRef.current.scrollBy({left:320,behavior:"smooth"});
};



return(

<div className="home-container">

<Navbar/>


<div className="hero-section">

<h1 className="hero-title">
Sve za planiranje putovanja na jednom mestu
</h1>

<p className="hero-subtitle">
Planiraj destinacije, deli plan sa prijateljima i organizuj svaki detalj putovanja.
</p>

<button
className="hero-button"
onClick={()=>setShowCreate(true)}
>
Započni planiranje
</button>

</div>


{}

<div className="trip-filter-bar">

<button
className={filter==="sva" ? "filter-btn active" : "filter-btn"}
onClick={()=>setFilter("sva")}
>
Sva putovanja
</button>

<button
className={filter==="moja" ? "filter-btn active" : "filter-btn"}
onClick={()=>setFilter("moja")}
>
Moja putovanja
</button>

<button
className={filter==="kreator" ? "filter-btn active" : "filter-btn"}
onClick={()=>setFilter("kreator")}
>
Kao kreator
</button>

<button
className={filter==="clan" ? "filter-btn active" : "filter-btn"}
onClick={()=>setFilter("clan")}
>
Kao član
</button>

<button
className={filter==="nisam" ? "filter-btn active" : "filter-btn"}
onClick={()=>setFilter("nisam")}
>
Nisam član
</button>

</div>


<div className="slider-wrapper">

<button className="slider-arrow left" onClick={slideLeft}>‹</button>

<div className="trip-grid" ref={sliderRef}>

{filteredTrips.map(trip=>{

const creator = trip.kreatorId===user?.id;
const member = isMember(trip.id);

return(

<div
key={trip.id}
className="trip-card"
onClick={()=>openTrip(trip)}
>

<img
src={getImage(trip.destinacija)}
className="trip-image"
alt="trip"
/>

<div className="trip-overlay">

<h2>{trip.destinacija}</h2>
<p>{trip.naziv}</p>

<span className="trip-date">
{formatDate(trip.datumOd)} — {formatDate(trip.datumDo)}
</span>

</div>

{creator && <div className="trip-badge">Kreator</div>}
{member && !creator && <div className="trip-badge">Član</div>}

{!creator && !member && (

<button
className="trip-join-btn"
onClick={(e)=>{
e.stopPropagation();
joinTrip(trip.id);
}}
>
Pridruži se
</button>

)}

</div>

);

})}

</div>

<button className="slider-arrow right" onClick={slideRight}>›</button>

</div>


{showCreate && (

<div className="create-trip-modal">

<div className="create-trip-box">

<h2>Kreiraj putovanje</h2>

<input
placeholder="Naziv putovanja"
value={newTrip.naziv}
onChange={e=>setNewTrip({...newTrip,naziv:e.target.value})}
/>

<input
placeholder="Destinacija"
value={newTrip.destinacija}
onChange={e=>setNewTrip({...newTrip,destinacija:e.target.value})}
/>

<input
type="date"
value={newTrip.datumOd}
onChange={e=>setNewTrip({...newTrip,datumOd:e.target.value})}
/>

<input
type="date"
value={newTrip.datumDo}
onChange={e=>setNewTrip({...newTrip,datumDo:e.target.value})}
/>

<textarea
placeholder="Opis"
value={newTrip.opis}
onChange={e=>setNewTrip({...newTrip,opis:e.target.value})}
/>

<div className="create-buttons">

<button onClick={createTrip}>Kreiraj</button>
<button onClick={()=>setShowCreate(false)}>Otkaži</button>

</div>

</div>

</div>

)}

</div>

);

}

export default HomePage;