import { useEffect, useMemo, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  flightId: ""
};

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function App() {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [flightsResponse, bookingsResponse] = await Promise.all([
          fetch("/api/flights"),
          fetch("/api/bookings")
        ]);

        if (!flightsResponse.ok) {
          throw new Error("Could not fetch flights");
        }
        if (!bookingsResponse.ok) {
          throw new Error("Could not fetch bookings");
        }

        const [flightsData, bookingsData] = await Promise.all([
          flightsResponse.json(),
          bookingsResponse.json()
        ]);
        setFlights(flightsData);
        setBookings(bookingsData);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.email.trim() && form.flightId;
  }, [form]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setStatusMessage("");
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setStatusMessage(`${data.message}. Booking ID: ${data.booking.id}`);
      setBookings((prev) => [data.booking, ...prev]);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <div className="page">
      <header>
        <h1>Yorker Airlines</h1>
        <p>Book smarter with transparent routes and fares.</p>
      </header>

      <section className="panel">
        <h2>Available Flights</h2>
        {loading && <p>Loading flights...</p>}
        {!loading && !flights.length && <p>No flights available right now.</p>}

        <ul className="flight-list">
          {flights.map((flight) => (
            <li key={flight.id} className="flight-item">
              <div>
                <strong>{flight.id}</strong>
                <p>
                  {flight.from} to {flight.to}
                </p>
                <small>Aircraft: {flight.aircraft}</small>
                <br />
                <small>Departure: {formatDate(flight.departure)}</small>
              </div>
              <span>${flight.price}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Book a Flight</h2>
        <form onSubmit={onSubmit} className="booking-form">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Jane Doe"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="jane@example.com"
            />
          </label>

          <label>
            Flight
            <select name="flightId" value={form.flightId} onChange={onChange}>
              <option value="">Select a flight</option>
              {flights.map((flight) => (
                <option key={flight.id} value={flight.id}>
                  {flight.id}: {flight.from} to {flight.to} ({flight.aircraft})
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={!canSubmit}>
            Confirm Booking
          </button>
        </form>

        {statusMessage && <p className="success">{statusMessage}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel">
        <h2>Recent Bookings</h2>
        {!bookings.length && <p>No bookings yet.</p>}
        <ul className="booking-list">
          {bookings.map((booking) => (
            <li key={booking.id} className="booking-item">
              <strong>{booking.id}</strong>
              <span>
                {booking.name} - {booking.flight}
              </span>
              <small>
                {booking.aircraft} | {formatDate(booking.createdAt)}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
