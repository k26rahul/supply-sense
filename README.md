# SupplySense Prototype

A hackathon demo prototype for real-time regional shortage detection and automated stock redistribution in public health networks, integrated with an interactive real map of Udupi Taluk, Karnataka.

## Architecture

- **Backend**: FastAPI with in-memory state, managed with `uv`.
- **Frontend**: React + Vite + Tailwind CSS + Leaflet (CartoDB Positron tiles, zero API keys required).
- **Geography**: Real public healthcare facilities in Udupi Taluk, Karnataka (Ajjarkad, Brahmavar, Malpe, Manipal, Kallianpur, Kaup).

## Getting Started

### 1. Run Backend

```powershell
cd backend
uv run uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The API runs at `http://127.0.0.1:8000`.

### 2. Run Frontend

```powershell
cd frontend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```

Open `http://127.0.0.1:5173` in your browser.

## Scripted Demo Flow (60 Seconds)

1. **Dashboard & Real Map**: View Udupi Taluk facilities color-coded by stock level on the real interactive map for *Oxytocin Injection*.
2. **Facility Telemetry**: Hover over or click **District Hospital Ajjarkad** (pulsing red dot) to inspect 45 units remaining, 1-2 days stock range, depletion trend, and replenishment history.
3. **Regional Alert Banner**: Observe the amber banner indicating an upstream cluster signal across 4 of 6 facilities in Udupi Taluk.
4. **Redistribution Suggestion**: Click **View Recommendation** on the alert banner to review the transfer proposal (150 units from Brahmavar CHC to District Hospital Ajjarkad via NH 66, 14 km away).
5. **Approve Transfer**: Click **Approve Transfer** to dispatch the stock.
6. **Live Mitigation**: Notice the dispatch confirmation, the dynamic route line on NH 66, and District Hospital Ajjarkad updating to "Transfer En Route" with extended runway.
