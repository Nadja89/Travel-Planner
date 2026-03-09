import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/TripDetails.css";

function TripDetailsPage(){

const {id} = useParams();

const [trip,setTrip]=useState(null);
const [activities,setActivities]=useState([]);
const [members,setMembers]=useState([]);
const [users,setUsers]=useState([]);

const [activeTab,setActiveTab]=useState("activities");

const [showModal,setShowModal]=useState(false);
const [editingActivity,setEditingActivity]=useState(null);

const [filter,setFilter]=useState("ALL");

const [form,setForm]=useState({
naziv:"",
opis:"",
datumVreme:"",
kategorija:"FOOD"
});


const categoryIcons={
FOOD:"🍽",
SIGHTSEEING:"📍",
MUSEUM:"🏛",
NATURE:"🌳",
SHOPPING:"🛍",
TRANSPORT:"🚆",
OTHER:"⭐"
};


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


useEffect(()=>{

const loadData=async()=>{

const tripRes = await fetch("http://localhost:3001/trip-plans");
const tripData = await tripRes.json();
const currentTrip = tripData.find(t=>t.id===id);
setTrip(currentTrip);

const actRes = await fetch("http://localhost:3001/activities");
const actData = await actRes.json();

const tripActivities = actData
.filter(a=>a.tripPlanId===id)
.sort((a,b)=>new Date(a.datumVreme)-new Date(b.datumVreme));

setActivities(tripActivities);

const memRes = await fetch("http://localhost:3001/trip-members");
const memData = await memRes.json();
setMembers(memData.filter(m=>m.tripPlanId===id));

const userRes = await fetch("http://localhost:3001/users");
const userData = await userRes.json();
setUsers(userData);

};

loadData();

},[id]);



const getUserName=(userId)=>{
const u = users.find(u=>u.id===userId);
return u ? u.ime : "Nepoznat korisnik";
};



function openAddModal(){
setEditingActivity(null);
setForm({
naziv:"",
opis:"",
datumVreme:"",
kategorija:"FOOD"
});
setShowModal(true);
}

function openEditModal(activity){
setEditingActivity(activity);
setForm(activity);
setShowModal(true);
}

function handleChange(e){
setForm({
...form,
[e.target.name]:e.target.value
});
}



async function saveActivity(){

if(editingActivity){

await fetch(`http://localhost:3001/activities/${editingActivity.id}`,{
method:"PATCH",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(form)
});

}else{

await fetch("http://localhost:3001/activities",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
...form,
tripPlanId:id
})
});

}

window.location.reload();

}



async function deleteActivity(actId){

await fetch(`http://localhost:3001/activities/${actId}`,{
method:"DELETE"
});

window.location.reload();

}

if(!trip) return null;


const filteredActivities =
filter==="ALL"
?activities
:activities.filter(a=>a.kategorija===filter);



const grouped={};

filteredActivities.forEach(a=>{

const date=new Date(a.datumVreme).toLocaleDateString("sr-RS");

if(!grouped[date]) grouped[date]=[];

grouped[date].push(a);

});

return(

<div className="trip-page">

<Navbar/>

{}

<div
className="trip-hero"
style={{backgroundImage:`url(${getImage(trip.destinacija)})`}}
>

<div className="trip-hero-overlay">

<h1>{trip.naziv}</h1>

<div className="trip-meta">
<span>{trip.destinacija}</span>
</div>

</div>

</div>

<div className="trip-content">

{}

<div className="trip-tabs">

<button
className={activeTab==="activities"?"tab active":"tab"}
onClick={()=>setActiveTab("activities")}

>

Aktivnosti </button>

<button
className={activeTab==="members"?"tab active":"tab"}
onClick={()=>setActiveTab("members")}

>

Članovi </button>

</div>

{}

{activeTab==="activities" &&(

<div>

<div className="activities-header">

<h2>Plan aktivnosti</h2>

<button className="add-activity-btn" onClick={openAddModal}>
Dodaj aktivnost
</button>

</div>

{}

<div className="activity-filter">

<button className={filter==="ALL"?"filter-btn active":"filter-btn"} onClick={()=>setFilter("ALL")}>Sve</button>

<button className={filter==="FOOD"?"filter-btn active":"filter-btn"} onClick={()=>setFilter("FOOD")}>Hrana</button>

<button className={filter==="SIGHTSEEING"?"filter-btn active":"filter-btn"} onClick={()=>setFilter("SIGHTSEEING")}>Znamenitosti</button>

<button className={filter==="MUSEUM"?"filter-btn active":"filter-btn"} onClick={()=>setFilter("MUSEUM")}>Muzeji</button>

<button className={filter==="NATURE"?"filter-btn active":"filter-btn"} onClick={()=>setFilter("NATURE")}>Priroda</button>

<button className={filter==="SHOPPING"?"filter-btn active":"filter-btn"} onClick={()=>setFilter("SHOPPING")}>Kupovina</button>

</div>

{}

{Object.keys(grouped).map(date=>(

<div key={date} className="day-section">

<h3 className="day-title">{date}</h3>

{grouped[date].map(a=>(

<div key={a.id} className="activity-card">

<div className="activity-info">

<div className="activity-title">

<span className="activity-icon">
{categoryIcons[a.kategorija]}
</span>

<span className="activity-name">
{a.naziv}
</span>

</div>

<div className="activity-time">
{new Date(a.datumVreme).toLocaleTimeString("sr-RS",{hour:"2-digit",minute:"2-digit"})}
</div>

<div className="activity-desc">
{a.opis}
</div>

</div>

<div className="activity-actions">

<button className="edit-btn" onClick={()=>openEditModal(a)}>
Izmeni </button>

<button className="delete-btn" onClick={()=>deleteActivity(a.id)}>
Obriši </button>

</div>

</div>

))}

</div>

))}

</div>

)}

{}

{activeTab==="members" &&(

<div className="members-list">

{members.map(m=>{

const name = getUserName(m.userId);

return(

<div key={m.id} className="member-card">

<div className="member-avatar">
{name.charAt(0)}
</div>

<div>

<div className="member-name">
{name}
</div>

<div className="member-role">
{m.uloga==="kreator" ? "kreator" : "član"}
</div>

</div>

</div>

);

})}

</div>

)}

</div>

{}

{showModal &&(

<div className="activity-modal">

<div className="activity-modal-box">

<h3>{editingActivity?"Izmeni aktivnost":"Dodaj aktivnost"}</h3>

<input
name="naziv"
placeholder="Naziv aktivnosti"
value={form.naziv}
onChange={handleChange}
/>

<select
name="kategorija"
value={form.kategorija}
onChange={handleChange}

>

<option value="FOOD">Hrana</option>
<option value="SIGHTSEEING">Znamenitosti</option>
<option value="MUSEUM">Muzeji</option>
<option value="NATURE">Priroda</option>
<option value="SHOPPING">Kupovina</option>
<option value="TRANSPORT">Prevoz</option>
<option value="OTHER">Ostalo</option>

</select>

<input
type="datetime-local"
name="datumVreme"
value={form.datumVreme}
onChange={handleChange}
/>

<textarea
name="opis"
placeholder="Opis"
value={form.opis}
onChange={handleChange}
/>

<div className="modal-buttons">

<button className="save-btn" onClick={saveActivity}>
Sačuvaj
</button>

<button className="cancel-btn" onClick={()=>setShowModal(false)}>
Otkaži
</button>

</div>

</div>

</div>

)}

</div>

);

}

export default TripDetailsPage;
