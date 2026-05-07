import cors from "cors";
import express from "express";
import { pathToFileURL } from "url";

const app = express();
const BASE_PORT = Number(process.env.PORT) || 4000;

const flights = [
  {
    id: "YA101",
    from: "New York",
    to: "London",
    departure: "2026-05-07T09:15:00Z",
    price: 689,
    aircraft: "Airbus A350"
  },
  {
    id: "YA202",
    from: "San Francisco",
    to: "Tokyo",
    departure: "2026-05-08T18:45:00Z",
    price: 954,
    aircraft: "Boeing 787 Dreamliner"
  },
  {
    id: "YA303",
    from: "Chicago",
    to: "Paris",
    departure: "2026-05-09T13:30:00Z",
    price: 732,
    aircraft: "Airbus A330"
  }
];

const bookings = [];

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Yorker Airlines API" });
});

app.get("/api/flights", (_req, res) => {
  res.json(flights);
});

app.get("/api/bookings", (_req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const { name, email, flightId } = req.body;

  if (!name || !email || !flightId) {
    return res.status(400).json({
      error: "name, email, and flightId are required"
    });
  }

  const selectedFlight = flights.find((flight) => flight.id === flightId);
  if (!selectedFlight) {
    return res.status(404).json({ error: "Flight not found" });
  }

  const booking = {
    id: `BK-${Date.now()}`,
    name,
    email,
    flightId: selectedFlight.id,
    flight: `${selectedFlight.from} to ${selectedFlight.to}`,
    aircraft: selectedFlight.aircraft,
    createdAt: new Date().toISOString()
  };

  bookings.unshift(booking);

  return res.status(201).json({
    message: "Booking confirmed",
    booking
  });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Yorker Airlines API running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.log(`Port ${port} in use, retrying on ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    throw error;
  });
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  startServer(BASE_PORT);
}

export { app };
