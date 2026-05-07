import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { app } from "../src/index.js";

test("GET /api/health returns API status", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("GET /api/flights returns available flights", async () => {
  const response = await request(app).get("/api/flights");

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);
  assert.ok(response.body[0].aircraft);
});

test("POST /api/bookings creates booking and appears in bookings list", async () => {
  const bookingPayload = {
    name: "Test User",
    email: "test@example.com",
    flightId: "YA101"
  };

  const createResponse = await request(app)
    .post("/api/bookings")
    .send(bookingPayload);

  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.message, "Booking confirmed");
  assert.equal(createResponse.body.booking.flightId, "YA101");

  const listResponse = await request(app).get("/api/bookings");
  assert.equal(listResponse.status, 200);
  assert.ok(Array.isArray(listResponse.body));
  assert.ok(
    listResponse.body.some((booking) => booking.id === createResponse.body.booking.id)
  );
});
