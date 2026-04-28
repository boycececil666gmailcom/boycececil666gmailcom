# API Types Explained: A Parking System Case Study

APIs are the communication contracts that let software components talk to each other. This article walks through every major API type, then puts them all together with a real-world parking garage system.

---

## What Is an API?

An **API (Application Programming Interface)** is a defined way for one piece of software to request a service from another. The calling code doesn't need to know *how* the work gets done — only *what* to ask for and *how* to ask for it.

Think of it like a restaurant menu. The kitchen (the service) hides how the food is made. The menu (the interface) tells you what you can order and how to order it.

---

## The Six API Types

### 1. Library API — No Network

Functions and classes used within the same program. No network involved.

```
my_unity_script.cs
    Math.Sqrt(16)           // C# library API
    transform.Translate(...) // Unity engine API
    Mathf.Clamp(value, 0, 1) // Unity library API
```

**Analogy:** Reaching into your own toolbox. You don't leave the house.

---

### 2. OS / System API — No Network

A program asks the operating system for services — file access, camera, keyboard, display.

```
CreateFile(...)        // Windows API
open("/dev/camera")    // Linux API
pthread_create(...)     // POSIX threading API
```

**Analogy:** Asking building management for services — elevator access, utilities, mail room.

---

### 3. Database API — Usually No Network Protocol

Your program talks to a database through a driver. The driver uses a binary protocol (not HTTP).

```
# Python with sqlite3 — no HTTP, just direct driver calls
conn = sqlite3.connect("parking.db")
cursor.execute("SELECT * FROM tickets WHERE status = 'active'")
```

```
// C# with ADO.NET — database driver protocol
var cmd = new SqlCommand("SELECT spot_id FROM spots WHERE floor = 2", conn);
```

**Analogy:** Asking a librarian. You speak a specific protocol (SQL-ish), and the librarian fetches records from the back room.

---

### 4. REST API — Uses HTTP

The most common web API style. Resources (nouns) + HTTP verbs (GET, POST, PUT, DELETE).

```
GET    /parking/spots          // fetch all available spots
POST   /parking/entry          // log a vehicle entry
PUT    /parking/ticket/123     // update ticket (e.g., payment)
DELETE /parking/exit/123       // close out a session
```

Every request is stateless — the server doesn't remember the last call.

**Analogy:** Ordering from a menu with standard actions. "I want the steak" (GET), "add fries to my order" (POST), "swap fries for salad" (PUT).

---

### 5. GraphQL API — Usually HTTP

The client specifies *exactly* which fields it needs. One request, no over-fetching.

```
query {
  spot(floor: 2, type: compact) {
    id
    status
    nearestElevator
  }
}
```

Instead of getting a full spot object with 20 fields, the mobile app gets only the 3 it displays.

**Analogy:** A custom order at a deli. Not "give me a sandwich" — "white bread, no mayo, extra pickles, wheat bread."

---

### 6. gRPC API — Usually HTTP/2

Remote Procedure Call. You call a function on another machine as if it were local. Faster than REST because it uses binary protocol (Protocol Buffers) instead of JSON.

```
// Protocol Buffer definition
service PaymentService {
  rpc ProcessPayment(PaymentRequest) returns (PaymentResponse);
  rpc Refund(RefundRequest) returns (RefundResponse);
}
```

Internal microservices use gRPC for speed. External-facing clients use REST.

**Analogy:** A direct business hotline. No paperwork, no standard form — just pick up the phone and say "process payment for $15."

---

### 7. SOAP API — Usually HTTP

XML-based, formal, enterprise. Common in banking and legacy government systems. Heavily structured with strict contracts.

```
POST /PaymentService HTTP/1.1
Content-Type: text/xml

<soap:Envelope>
  <soap:Body>
    <ProcessPayment>
      <amount>15.00</amount>
      <cardToken>tok_123</cardToken>
    </ProcessPayment>
  </soap:Body>
</soap:Envelope>
```

**Analogy:** Formal paperwork. Every field is labeled, stamped, and filed.

---

### 8. WebSocket API — Starts as HTTP Upgrade

A persistent two-way connection. Unlike REST where the client asks and the server answers, WebSocket keeps the line open — the server can push data to the client at any time.

```
# Client opens connection
ws = new WebSocket("wss://parking-garage.com/live")
ws.onmessage = (event) => updateSpotDisplay(JSON.parse(event.data))

# Server pushes when a spot opens up
# {"floor": 2, "spot": "A-14", "event": "vacated"}
```

**Analogy:** An open phone call. You don't send letters back and forth — whoever has news speaks first.

---

## Quick Reference Table

| Category | Uses HTTP? | Real-Life Analogy |
|---|---|---|
| Library API | No | Using tools in your own toolbox |
| OS / System API | No | Asking building management |
| Database API | Usually No | Asking a librarian |
| REST API | Yes | Ordering from a menu |
| GraphQL API | Usually Yes | Custom deli order |
| gRPC API | Usually HTTP/2 | Business hotline |
| SOAP API | Usually Yes | Formal paperwork |
| WebSocket API | HTTP upgrade | Open phone call |

---

## Real Product: APIs Behind Common Apps

| Product | APIs Used |
|---|---|
| Food delivery app | Maps API, payment API, restaurant order API, notification API |
| E-commerce site | Product API, payment API, shipping API, auth API |
| Online game | Login API, matchmaking API, leaderboard API, WebSocket/game server |
| Social media | User API, post API, media upload API, recommendation API |
| Weather app | Weather data API, geolocation API |

---

## Real-Life Example: Designing a Parking System

When you park at a garage and pay at a kiosk, multiple APIs work together behind the scenes.

### The Architecture

![Parking System API Architecture](parking-system-api-diagram.png)

### Step by Step

```
You pull up to the gate
    ↓ Camera reads your license plate (device API)
    ↓ Gate controller receives signal to open (OS API)
    ↓ Entry Service logs the event (REST API)

You drive in — sensors track your spot
    ↓ Spot Manager reserves the space (REST API)
    ↓ Availability cached for the mobile app (Redis — database API)
    ↓ "Spot available" pushed to the garage display (WebSocket)

You pay at the kiosk
    ↓ Kiosk calls Payment Service (gRPC — internal, fast)
    ↓ Payment Service talks to Stripe (REST API)
    ↓ Kafka event fired: "payment_complete"

You leave — gate opens
    ↓ Exit Service validates your ticket (REST API)
    ↓ Ticket closed, spot marked available (database API)
    ↓ Notification sent: "thank you" (notification API)
    ↓ Reporting Service records revenue (event-driven)
```

### API Decisions at Each Layer

| Layer | API Type | Why |
|---|---|---|
| Camera, sensors, gate controller | OS / Device API | Must work offline, low-level hardware |
| Mobile app, admin portal, kiosk | REST API | Public, stateless, easy to debug |
| Payment processing (internal) | gRPC | High speed, binary protocol, internal only |
| Payment to Stripe | REST API | Stripe's public API is REST/HTTPS |
| Real-time spot availability on displays | WebSocket | Server pushes updates, no polling |
| Spot data, session records | Database API | Direct queries, no HTTP overhead |
| Analytics, reporting | Event-driven (Kafka) | Decoupled, async, doesn't block |

---

## The Buying Flow: APIs Cooperating

When you click **Buy** on a shopping site, five or six APIs cooperate in seconds:

```
Frontend App
    ↓
REST API — /checkout
    ↓
Payment Service API (gRPC internally)
    ↓
Inventory Service API
    ↓
Shipping API
    ↓
Email API
```

You see one confirmation screen. Behind it, a small orchestra of APIs negotiated the entire transaction.

---

## Choosing the Right API Style

| Situation | Best Choice |
|---|---|
| Public web/mobile backend | REST API |
| Flexible frontend data needs | GraphQL |
| Internal microservices, high speed | gRPC |
| Real-time chat, live prices, games | WebSocket |
| Old enterprise systems, banking | SOAP |
| Same-process code reuse | Library API |
| OS-level operations | System API |
| Database queries | Database API (via driver) |

---

## Summary

> **API** = the contract. **REST / GraphQL / gRPC / SOAP / WebSocket** = different styles of network API.

HTTP is common for web APIs, but many APIs don't use HTTP at all. The right choice depends on who is communicating, how fast it needs to be, and whether real-time updates are needed.
