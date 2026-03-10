import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

function HomePage() {
  const [tripPlans, setTripPlans] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("moja");

  const [newTrip, setNewTrip] = useState({
    naziv: "", destinacija: "", datumOd: "", datumDo: "", opis: ""
  });

  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const getDynamicImage = (dest) => {
    if (!dest) return "https://loremflickr.com/800/600/travel,sea";

  
    const query = dest.split(",")[0].trim().toLowerCase();
    
    
    return `https://loremflickr.com/800/600/${query},travel/all`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("sr-Latn-RS", {
      day: "2-digit", month: "long", year: "numeric"
    });
  };

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const res = await fetch("http://localhost:3001/trip-plans");
        const data = await res.json();
        setTripPlans(data);
      } catch (err) { console.error(err); }
    };
    const loadMemberships = async () => {
      if (!user) return;
      const res = await fetch("http://localhost:3001/trip-members");
      const data = await res.json();
      setMemberships(data.filter(m => m.userId === user.id));
    };
    loadTrips();
    loadMemberships();
  }, [user]);

  const isMember = (tripId) => memberships.some(m => m.tripPlanId === tripId);

  const filteredTrips = tripPlans.filter(trip => {
    const creator = trip.kreatorId === user?.id;
    const member = isMember(trip.id);
    if (filter === "sva") return true;
    if (filter === "moja") return creator || member;
    if (filter === "kreator") return creator;
    if (filter === "clan") return member;
    if (filter === "nisam") return !creator && !member;
    return true;
  });

  return (
    <div className="home-container">
      <Navbar />

      <div className="hero-section">
        <h1 className="hero-title">Sve za planiranje putovanja na jednom mestu</h1>
        <button className="hero-button" onClick={() => setShowCreate(true)}>Započni planiranje</button>
      </div>

      <div className="trip-filter-bar">
        {["sva", "moja", "kreator", "clan", "nisam"].map((f) => (
          <button key={f} className={filter === f ? "filter-btn active" : "filter-btn"} onClick={() => setFilter(f)}>
            {f === "sva" ? "Sva putovanja" : f === "moja" ? "Moja putovanja" : f === "kreator" ? "Kao kreator" : f === "clan" ? "Kao član" : "Nisam član"}
          </button>
        ))}
      </div>

      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={() => sliderRef.current.scrollBy({ left: -320, behavior: "smooth" })}>‹</button>
        
        <div className="trip-grid" ref={sliderRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '20px' }}>
          {filteredTrips.map(trip => {
            const creator = trip.kreatorId === user?.id;
            const member = isMember(trip.id);

            return (
              <div 
                key={trip.id} 
                className="trip-card" 
                onClick={() => navigate("/trip/" + trip.id)}
                style={{ 
                  position: 'relative', 
                  width: '320px', 
                  height: '400px', 
                  borderRadius: '25px', 
                  overflow: 'hidden', 
                  flexShrink: 0,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)' 
                }}
              >
               
                <img
                  src={getDynamicImage(trip.destinacija)}
                  alt={trip.destinacija}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0,
                    transition: 'transform 0.3s ease'
                  }}
                />

                
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '60%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                  zIndex: 1
                }}></div>

                <div className="trip-overlay" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '25px', color: 'white', zIndex: 2 }}>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>{trip.destinacija}</h2>
                  <p style={{ margin: '5px 0', fontSize: '1.1rem', opacity: 0.9 }}>{trip.naziv}</p>
                  <span className="trip-date" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    {formatDate(trip.datumOd)} — {formatDate(trip.datumDo)}
                  </span>
                </div>

                {(creator || member) && (
                  <div className="trip-badge" style={{ position: 'absolute', top: '20px', left: '20px', background: '#7b61ff', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', zIndex: 3, fontWeight: 'bold' }}>
                    {creator ? "Kreator" : "Član"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="slider-arrow right" onClick={() => sliderRef.current.scrollBy({ left: 320, behavior: "smooth" })}>›</button>
      </div>

      {showCreate && (
        <div className="create-trip-modal">
          <div className="create-trip-box">
            <h2>Kreiraj putovanje</h2>
            <input placeholder="Naziv" value={newTrip.naziv} onChange={e => setNewTrip({ ...newTrip, naziv: e.target.value })} />
            <input placeholder="Destinacija (npr. Venecija)" value={newTrip.destinacija} onChange={e => setNewTrip({ ...newTrip, destinacija: e.target.value })} />
            <input type="date" value={newTrip.datumOd} onChange={e => setNewTrip({ ...newTrip, datumOd: e.target.value })} />
            <input type="date" value={newTrip.datumDo} onChange={e => setNewTrip({ ...newTrip, datumDo: e.target.value })} />
            <div className="create-buttons">
              <button onClick={async () => {
                const res = await fetch("http://localhost:3001/trip-plans", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...newTrip, kreatorId: user.id })
                });
                if (res.ok) window.location.reload();
              }}>Kreiraj</button>
              <button onClick={() => setShowCreate(false)}>Otkaži</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;