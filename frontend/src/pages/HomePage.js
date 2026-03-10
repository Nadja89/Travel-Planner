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
    naziv: "",
    destinacija: "",
    datumOd: "",
    datumDo: "",
    opis: ""
  });

  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const getDynamicImage = (dest) => {
    if (!dest) return "https://loremflickr.com/800/600/travel";
    const query = dest.split(",")[0].trim().toLowerCase();
    return `https://loremflickr.com/800/600/${query},travel`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const res = await fetch("http://localhost:3001/trip-plans");
        const data = await res.json();
        setTripPlans(data);
      } catch (err) {
        console.error(err);
      }
    };

    const loadMemberships = async () => {
      if (!user) return;
      const res = await fetch("http://localhost:3001/trip-members");
      const data = await res.json();
      setMemberships(
        data.filter(m => String(m.userId) === String(user.id))
      );
    };

    loadTrips();
    loadMemberships();
  }, [user]);

  const isMember = (tripId) =>
    memberships.some(m => String(m.tripPlanId) === String(tripId));

  const filteredTrips = tripPlans.filter(trip => {
    const creator = String(trip.kreatorId) === String(user?.id);
    const member = memberships.some(m => String(m.tripPlanId) === String(trip.id));

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
        <h1 className="hero-title">
          Sve za planiranje putovanja na jednom mestu
        </h1>

        <button
          className="hero-button"
          onClick={() => setShowCreate(true)}
        >
          Započni planiranje
        </button>
      </div>

      <div className="trip-filter-bar">
        {["sva", "moja", "kreator", "clan", "nisam"].map((f) => (
          <button
            key={f}
            className={filter === f ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter(f)}
          >
            {f === "sva"
              ? "Sva putovanja"
              : f === "moja"
              ? "Moja putovanja"
              : f === "kreator"
              ? "Kao kreator"
              : f === "clan"
              ? "Kao član"
              : "Nisam član"}
          </button>
        ))}
      </div>

      <div className="slider-wrapper">
        <button
          className="slider-arrow left"
          onClick={() =>
            sliderRef.current.scrollBy({ left: -420, behavior: "smooth" })
          }
        >
          ‹
        </button>

        <div className="trip-grid" ref={sliderRef}>
          {filteredTrips.map(trip => {
            const creator = String(trip.kreatorId) === String(user?.id);
            const member = isMember(trip.id);

            return (
              <div
                key={trip.id}
                className="trip-card"
                onClick={() => {
                  if (creator || member) {
                    navigate("/trip/" + trip.id);
                  }
                }}
              >
                <img
                  src={getDynamicImage(trip.destinacija)}
                  alt={trip.destinacija}
                  className="trip-image"
                />

                <div className="trip-overlay">
                  <h2>{trip.destinacija}</h2>
                  <p>{trip.naziv}</p>

                  <span className="trip-date">
                    {formatDate(trip.datumOd)} — {formatDate(trip.datumDo)}
                  </span>
                </div>

                {creator ? (
                  <div className="trip-badge">Kreator</div>
                ) : member ? (
                  <div className="trip-badge">Član</div>
                ) : (
                  <button
                    className="trip-join-btn"
                    onClick={async (e) => {
                      e.stopPropagation();

                      const res = await fetch("http://localhost:3001/trip-members", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                          tripPlanId: String(trip.id),
                          userId: String(user.id),
                          uloga: "clan"
                        })
                      });

                      if (res.ok) {
                        window.location.reload();
                      } else {
                        alert("Greška pri pridruživanju.");
                      }
                    }}
                  >
                    Pridruži se
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="slider-arrow right"
          onClick={() =>
            sliderRef.current.scrollBy({ left: 420, behavior: "smooth" })
          }
        >
          ›
        </button>
      </div>

      {showCreate && (
        <div className="create-trip-modal">
          <div className="create-trip-box">
            <h2>Kreiraj putovanje</h2>

            <input
              placeholder="Naziv"
              value={newTrip.naziv}
              onChange={e =>
                setNewTrip({ ...newTrip, naziv: e.target.value })
              }
            />

            <input
              placeholder="Destinacija"
              value={newTrip.destinacija}
              onChange={e =>
                setNewTrip({ ...newTrip, destinacija: e.target.value })
              }
            />

            <input
              type="date"
              value={newTrip.datumOd}
              onChange={e =>
                setNewTrip({ ...newTrip, datumOd: e.target.value })
              }
            />

            <input
              type="date"
              value={newTrip.datumDo}
              onChange={e =>
                setNewTrip({ ...newTrip, datumDo: e.target.value })
              }
            />

            <div className="create-buttons">
              <button
                onClick={async () => {
                  const res = await fetch("http://localhost:3001/trip-plans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...newTrip,
                      kreatorId: user.id
                    })
                  });

                  if (res.ok) {
                    window.location.reload();
                  }
                }}
              >
                Kreiraj
              </button>

              <button onClick={() => setShowCreate(false)}>
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;