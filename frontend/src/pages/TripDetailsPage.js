import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import socket from "../socket"; 
import "../styles/TripDetails.css";

function TripDetailsPage() {
  const { id } = useParams();
  const socketRef = useRef(null);

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = loggedUser?.id || "gost"; 

  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  const [activeTab, setActiveTab] = useState("activities");
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [form, setForm] = useState({ naziv: "", opis: "", datumVreme: "", kategorija: "Hrana" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  const [isLocked, setIsLocked] = useState(false);
  const [lockingUser, setLockingUser] = useState(null);

  const categoryIcons = {
    Hrana: "🍽", Znamenitosti: "📍", Muzeji: "🏛", Priroda: "🌳",
    Šoping: "🛍", Prevoz: "✈️", Karte: "🎟", Hotel: "🏨"
  };

  const getDynamicImage = (dest) => {
    if (!dest) return "https://loremflickr.com/1200/500/travel,sea/all";
    const query = dest.split(",")[0].trim().toLowerCase();
    return `https://loremflickr.com/1200/500/${query},travel/all`;
  };

 
  const refreshActivities = useCallback(async () => {
    try {
      const actRes = await fetch("http://localhost:3001/activities");
      const actData = await actRes.json();
      setActivities(
        actData
          .filter((a) => a.tripPlanId === id)
          .sort((a, b) => new Date(a.datumVreme) - new Date(b.datumVreme))
      );
    } catch (err) { console.error("Greška pri osvežavanju:", err); }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const tripRes = await fetch("http://localhost:3001/trip-plans");
        const tripData = await tripRes.json();
        setTrip(tripData.find((t) => t.id === id));

        await refreshActivities();

        const memRes = await fetch("http://localhost:3001/trip-members");
        const memData = await memRes.json();
        setMembers(memData.filter((m) => m.tripPlanId === id));

        const userRes = await fetch("http://localhost:3001/users");
        const userData = await userRes.json();
        setUsers(userData);
      } catch (err) { console.error("Greška:", err); }
    };
    loadData();
  }, [id, refreshActivities]);

  useEffect(() => {
    socketRef.current = socket;
    
   
    socketRef.current.emit("join_trip", id);

    socketRef.current.on("trip_locked", (data) => {
      if (data.userId !== currentUserId) {
        setIsLocked(true);
        setLockingUser(data.userId);
      }
    });

    socketRef.current.on("trip_unlocked", () => {
      setIsLocked(false);
      setLockingUser(null);
    });

 
    socketRef.current.on("activities_updated", () => {
      console.log("Stigao signal za ažuriranje!"); 
      refreshActivities();
    });
   socketRef.current.on("trip_deleted", () => {
    console.log("Plan je obrisan, prebacujem na home...");
    alert("Ovaj plan puta više ne postoji.");
    window.location.href = "/home"; 
  });

    return () => {
      socketRef.current.emit("unlock_trip", { tripPlanId: id, userId: currentUserId });
      socketRef.current.off("trip_locked");
      socketRef.current.off("trip_unlocked");
      socketRef.current.off("activities_updated");
      socketRef.current.off("trip_deleted");
    };
  }, [id, currentUserId, refreshActivities]);

  const getUserName = (userId) => {
    const u = users.find((u) => u.id === userId);
    return u ? (u.imePrezime || u.korisnickoIme) : "Korisnik";
  };

  async function saveActivity() {
    const url = editingActivity ? `http://localhost:3001/activities/${editingActivity.id}` : "http://localhost:3001/activities";
    const method = editingActivity ? "PATCH" : "POST";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingActivity ? form : { ...form, tripPlanId: id }),
    });

    if (res.ok) {
      socketRef.current.emit("update_activities", { tripPlanId: id });

      await fetch(`http://localhost:3001/trip-locks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripPlanId: id, userId: currentUserId }),
      });
      setShowModal(false);
      refreshActivities(); 
    }
  }

  const deleteActivity = async () => {
    const res = await fetch(`http://localhost:3001/activities/${activityToDelete}`, {
      method: "DELETE"
    });
    if (res.ok) {
      socketRef.current.emit("update_activities", { tripPlanId: id });
      setActivities(prev => prev.filter(a => a.id !== activityToDelete));
    }
    setShowDeleteModal(false);
    setActivityToDelete(null);
  };

  const tryLockAndOpenModal = async (isEdit, activity = null) => {
    if (isLocked && lockingUser !== currentUserId) {
      alert(`Plan trenutno uređuje ${getUserName(lockingUser)}.`);
      return;
    }
    const res = await fetch(`http://localhost:3001/trip-locks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripPlanId: id, userId: currentUserId }),
    });
    const data = await res.json();
    if (!data.success) return;

    if (isEdit) { setEditingActivity(activity); setForm(activity); }
    else { setEditingActivity(null); setForm({ naziv: "", opis: "", datumVreme: "", kategorija: "Hrana" }); }
    setShowModal(true);
  };

  const cancelModal = async () => {
    await fetch(`http://localhost:3001/trip-locks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripPlanId: id, userId: currentUserId }),
    });
    setShowModal(false);
  };

  async function leaveTrip() {
    const membership = members.find(m => m.userId === currentUserId && m.tripPlanId === id);
    if (!membership) return;
    const res = await fetch(`http://localhost:3001/trip-members/${membership.id}`, { method: "DELETE" });
    if (res.ok) window.location.href = "/home";
  }

  if (!trip) return <div className="loading">Učitavanje...</div>;

  const isCreator = trip.kreatorId === currentUserId;
  const filteredActivities = filter === "ALL" ? activities : activities.filter((a) => a.kategorija === filter);
  const grouped = {};
  filteredActivities.forEach((a) => {
    const date = new Date(a.datumVreme).toLocaleDateString("sr-RS");
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(a);
  });

  return (
    <div className="trip-page">
      <Navbar />
      {isLocked && <div className="lock-banner">Plan trenutno uređuje: {getUserName(lockingUser)}</div>}
      <div className="trip-hero" style={{ backgroundImage: `url(${getDynamicImage(trip.destinacija)})` }}>
        <div className="trip-hero-overlay">
          <h1>{trip.naziv}</h1>
          <div className="trip-meta"><span>{trip.destinacija}</span></div>
          {!isCreator && <button className="leave-trip-btn" onClick={leaveTrip}>Napusti putovanje</button>}
        </div>
      </div>
      <div className="trip-content">
        <div className="trip-tabs">
          <button className={activeTab === "activities" ? "tab active" : "tab"} onClick={() => setActiveTab("activities")}>Aktivnosti</button>
          <button className={activeTab === "members" ? "tab active" : "tab"} onClick={() => setActiveTab("members")}>Članovi</button>
        </div>
        {activeTab === "activities" && (
          <div>
            <div className="activities-header">
              <h2>Plan aktivnosti</h2>
              <button className="add-activity-btn" onClick={() => tryLockAndOpenModal(false)}>Dodaj aktivnost</button>
            </div>
            <div className="activity-filter">
             {["ALL","Hrana","Znamenitosti","Muzeji","Priroda","Šoping","Prevoz","Karte","Hotel"].map((cat) => (
               <button key={cat} className={filter === cat ? "filter-btn active" : "filter-btn"} onClick={() => setFilter(cat)}>
                 {cat === "ALL" ? "Sve" : cat}
               </button>
             ))}
            </div>
            {Object.keys(grouped).map((date) => (
              <div key={date} className="day-section">
                <h3 className="day-title">{date}</h3>
                {grouped[date].map((a) => (
                  <div key={a.id} className="activity-card">
                    <div className="activity-info">
                      <div className="activity-title">
                        <span className="activity-icon">{categoryIcons[a.kategorija]}</span>
                        <span className="activity-name">{a.naziv}</span>
                      </div>
                      <div className="activity-time">{new Date(a.datumVreme).toLocaleTimeString("sr-RS",{ hour:"2-digit", minute:"2-digit" })}</div>
                      <div className="activity-desc">{a.opis}</div>
                    </div>
                    <div className="activity-actions">
                      <button className="edit-btn" onClick={() => tryLockAndOpenModal(true, a)}>Izmeni</button>
                      {isCreator && <button className="delete-btn" onClick={() => { setActivityToDelete(a.id); setShowDeleteModal(true); }}>Obriši</button>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {activeTab === "members" && (
          <div className="members-list">
            <div className="member-card">
              <div className="member-avatar">{getUserName(trip.kreatorId).charAt(0)}</div>
              <div><div className="member-name">{getUserName(trip.kreatorId)}</div><div className="member-role">Kreator</div></div>
            </div>
            {members.filter(m => m.userId !== trip.kreatorId).map(m => (
              <div key={m.id} className="member-card">
                <div className="member-avatar">{getUserName(m.userId).charAt(0)}</div>
                <div><div className="member-name">{getUserName(m.userId)}</div><div className="member-role">{m.uloga}</div></div>
              </div>
            ))}
            {isCreator && <button className="delete-trip-btn" onClick={() => window.confirm("Obriši?") && fetch(`http://localhost:3001/trip-plans/${trip.id}`, { method: "DELETE" })}>Obriši putovanje</button>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="activity-modal">
          <div className="activity-modal-box">
            <h3>{editingActivity ? "Izmeni" : "Dodaj"}</h3>
            <input placeholder="Naziv" value={form.naziv} onChange={(e)=>setForm({...form,naziv:e.target.value})} />
            <select value={form.kategorija} onChange={(e)=>setForm({...form,kategorija:e.target.value})}>
               {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input type="datetime-local" value={form.datumVreme} onChange={(e)=>setForm({...form,datumVreme:e.target.value})} />
            <textarea placeholder="Opis" value={form.opis} onChange={(e)=>setForm({...form,opis:e.target.value})} />
            <div className="modal-buttons">
              <button className="save-btn" onClick={saveActivity}>Sačuvaj</button>
              <button className="cancel-btn" onClick={cancelModal}>Otkaži</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="activity-modal">
          <div className="activity-modal-box">
            <h3>Potvrda brisanja</h3>
            <div className="modal-buttons">
              <button className="delete-btn" onClick={deleteActivity}>Obriši</button>
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Odustani</button>
            </div>
          </div>
        </div>
      )}

      <div className="trip-map-section">
        <iframe title="map" width="100%" height="420" style={{ border: 0, borderRadius: "14px" }} 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(trip.destinacija)}&output=embed`}></iframe>
      </div>
    </div>
  );
}

export default TripDetailsPage;