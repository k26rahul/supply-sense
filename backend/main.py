from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

app = FastAPI(title="SupplySense API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ApproveTransferRequest(BaseModel):
    transfer_id: str

# Seed dataset maintained in-memory for the demo session.
MEDICINES = [
    {
        "id": "oxytocin",
        "name": "Oxytocin Injection",
        "category": "Maternal Health / Uterotonic",
        "unit": "Ampoules (10 IU)",
        "has_regional_signal": True,
        "description": "Essential uterotonic for preventing postpartum hemorrhage.",
    },
    {
        "id": "ors",
        "name": "ORS Sachets",
        "category": "Essential Salts",
        "unit": "Packets (20.5g)",
        "has_regional_signal": False,
        "description": "Oral rehydration salt formulation for dehydration management.",
    },
    {
        "id": "amoxicillin",
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "unit": "Capsules",
        "has_regional_signal": False,
        "description": "Broad-spectrum antibiotic for primary care infections.",
    },
    {
        "id": "paracetamol",
        "name": "Paracetamol 500mg",
        "category": "Analgesic & Antipyretic",
        "unit": "Tablets",
        "has_regional_signal": False,
        "description": "Standard pain and fever relief medication.",
    },
    {
        "id": "measles",
        "name": "Measles Vaccine",
        "category": "Immunization",
        "unit": "Vials (10 doses)",
        "has_regional_signal": False,
        "description": "Live attenuated vaccine with cold chain requirements.",
    },
]

# Real public healthcare facilities in Udupi Taluk, Karnataka.
FACILITY_METADATA = [
    {
        "id": "fac-a",
        "name": "Brahmavar Community Health Centre",
        "type": "Community Health Centre",
        "taluk": "Brahmavar / Udupi Taluk",
        "locality": "Brahmavar",
        "lat": 13.4241,
        "lng": 74.7502,
        "distance_to_d_km": 14,
        "travel_time_min": 24,
    },
    {
        "id": "fac-b",
        "name": "Malpe Primary Health Centre",
        "type": "Primary Health Centre",
        "taluk": "Udupi Taluk",
        "locality": "Malpe",
        "lat": 13.3551,
        "lng": 74.7032,
        "distance_to_d_km": 6,
        "travel_time_min": 14,
    },
    {
        "id": "fac-c",
        "name": "Manipal Urban Primary Health Centre",
        "type": "Urban Primary Health Centre",
        "taluk": "Udupi Taluk",
        "locality": "Manipal",
        "lat": 13.3533,
        "lng": 74.7865,
        "distance_to_d_km": 5,
        "travel_time_min": 12,
    },
    {
        "id": "fac-d",
        "name": "District Hospital Ajjarkad",
        "type": "District Hospital",
        "taluk": "Udupi Taluk",
        "locality": "Ajjarkad, Udupi",
        "lat": 13.3340,
        "lng": 74.7421,
        "distance_to_d_km": 0,
        "travel_time_min": 0,
    },
    {
        "id": "fac-e",
        "name": "Kallianpur Primary Health Centre",
        "type": "Primary Health Centre",
        "taluk": "Udupi Taluk",
        "locality": "Kallianpur / Santhekatte",
        "lat": 13.3854,
        "lng": 74.7561,
        "distance_to_d_km": 7,
        "travel_time_min": 15,
    },
    {
        "id": "fac-f",
        "name": "Kaup Community Health Centre",
        "type": "Community Health Centre",
        "taluk": "Kaup / Udupi Taluk",
        "locality": "Kaup",
        "lat": 13.2245,
        "lng": 74.7485,
        "distance_to_d_km": 15,
        "travel_time_min": 25,
    },
]

# Initial inventory state per medicine and facility in Udupi.
INITIAL_FACILITY_INVENTORY: Dict[str, Dict[str, Any]] = {
    "oxytocin": {
        "fac-a": {
            "status": "healthy",
            "status_label": "Surplus",
            "current_stock": 380,
            "days_of_stock": "18-22 days",
            "daily_consumption": 16,
            "trend": [430, 420, 410, 400, 395, 388, 380],
            "replenishment_history": [
                {"date": "Sep 08", "quantity": "250 units", "status": "Delivered"},
                {"date": "Aug 12", "quantity": "300 units", "status": "Delivered"},
            ],
            "last_updated": "Today, 09:30 AM",
            "data_reliability": "Verified",
        },
        "fac-b": {
            "status": "low",
            "status_label": "Low Stock",
            "current_stock": 78,
            "days_of_stock": "7-9 days",
            "daily_consumption": 10,
            "trend": [130, 120, 110, 102, 95, 86, 78],
            "replenishment_history": [
                {"date": "Aug 28", "quantity": "120 units", "status": "Delivered"}
            ],
            "last_updated": "Yesterday",
            "data_reliability": "Verified",
        },
        "fac-c": {
            "status": "low",
            "status_label": "Low Stock",
            "current_stock": 64,
            "days_of_stock": "7-8 days",
            "daily_consumption": 9,
            "trend": [120, 108, 98, 89, 81, 72, 64],
            "replenishment_history": [
                {"date": "Aug 25", "quantity": "100 units", "status": "Delivered"}
            ],
            "last_updated": "Today, 08:45 AM",
            "data_reliability": "Verified",
        },
        "fac-d": {
            "status": "critical",
            "status_label": "Critical",
            "current_stock": 45,
            "days_of_stock": "1-2 days",
            "daily_consumption": 26,
            "trend": [180, 155, 130, 105, 82, 60, 45],
            "replenishment_history": [
                {"date": "Sep 10", "quantity": "200 units", "status": "Delivered"},
                {"date": "Aug 15", "quantity": "250 units", "status": "Delivered"},
                {"date": "Jul 18", "quantity": "200 units", "status": "Delivered"},
            ],
            "last_updated": "Today, 11:15 AM",
            "data_reliability": "Verified (Live Telemetry)",
            "incoming_transfer": None,
        },
        "fac-e": {
            "status": "low",
            "status_label": "Low Stock",
            "current_stock": 82,
            "days_of_stock": "8-10 days",
            "daily_consumption": 9,
            "trend": [135, 124, 114, 105, 96, 88, 82],
            "replenishment_history": [
                {"date": "Aug 30", "quantity": "120 units", "status": "Delivered"}
            ],
            "last_updated": "Today, 10:00 AM",
            "data_reliability": "Verified",
        },
        "fac-f": {
            "status": "healthy",
            "status_label": "Healthy",
            "current_stock": 210,
            "days_of_stock": "15-18 days",
            "daily_consumption": 13,
            "trend": [245, 240, 232, 226, 220, 215, 210],
            "replenishment_history": [
                {"date": "Sep 05", "quantity": "150 units", "status": "Delivered"}
            ],
            "last_updated": "Yesterday",
            "data_reliability": "Verified",
        },
    },
    "ors": {
        "fac-a": {"status": "healthy", "status_label": "Healthy", "current_stock": 820, "days_of_stock": "20-25 days", "daily_consumption": 35, "trend": [880, 870, 860, 850, 840, 830, 820], "replenishment_history": [{"date": "Sep 01", "quantity": "500 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-b": {"status": "healthy", "status_label": "Healthy", "current_stock": 450, "days_of_stock": "18-22 days", "daily_consumption": 22, "trend": [500, 490, 480, 470, 465, 455, 450], "replenishment_history": [{"date": "Aug 20", "quantity": "300 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-c": {"status": "low", "status_label": "Low Stock", "current_stock": 190, "days_of_stock": "9-11 days", "daily_consumption": 19, "trend": [260, 245, 230, 218, 208, 198, 190], "replenishment_history": [{"date": "Aug 15", "quantity": "250 units", "status": "Delivered"}], "last_updated": "Yesterday", "data_reliability": "Verified"},
        "fac-d": {"status": "healthy", "status_label": "Healthy", "current_stock": 940, "days_of_stock": "16-19 days", "daily_consumption": 52, "trend": [1080, 1050, 1020, 1000, 980, 960, 940], "replenishment_history": [{"date": "Sep 02", "quantity": "600 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-e": {"status": "healthy", "status_label": "Healthy", "current_stock": 390, "days_of_stock": "17-20 days", "daily_consumption": 21, "trend": [440, 430, 420, 410, 400, 395, 390], "replenishment_history": [{"date": "Aug 25", "quantity": "250 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-f": {"status": "low", "status_label": "Low Stock", "current_stock": 140, "days_of_stock": "8-10 days", "daily_consumption": 15, "trend": [190, 180, 170, 162, 155, 148, 140], "replenishment_history": [{"date": "Aug 18", "quantity": "150 units", "status": "Delivered"}], "last_updated": "Yesterday", "data_reliability": "Verified"},
    },
    "amoxicillin": {
        "fac-a": {"status": "healthy", "status_label": "Healthy", "current_stock": 640, "days_of_stock": "19-23 days", "daily_consumption": 30, "trend": [700, 690, 680, 670, 660, 650, 640], "replenishment_history": [{"date": "Sep 03", "quantity": "400 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-b": {"status": "low", "status_label": "Low Stock", "current_stock": 130, "days_of_stock": "8-10 days", "daily_consumption": 14, "trend": [170, 160, 152, 145, 140, 135, 130], "replenishment_history": [{"date": "Aug 22", "quantity": "150 units", "status": "Delivered"}], "last_updated": "Yesterday", "data_reliability": "Verified"},
        "fac-c": {"status": "healthy", "status_label": "Healthy", "current_stock": 410, "days_of_stock": "16-19 days", "daily_consumption": 23, "trend": [460, 450, 440, 430, 425, 418, 410], "replenishment_history": [{"date": "Aug 29", "quantity": "300 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-d": {"status": "healthy", "status_label": "Healthy", "current_stock": 780, "days_of_stock": "18-21 days", "daily_consumption": 40, "trend": [860, 845, 830, 815, 800, 790, 780], "replenishment_history": [{"date": "Sep 07", "quantity": "500 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-e": {"status": "low", "status_label": "Low Stock", "current_stock": 125, "days_of_stock": "7-9 days", "daily_consumption": 15, "trend": [165, 158, 150, 144, 138, 132, 125], "replenishment_history": [{"date": "Aug 19", "quantity": "150 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-f": {"status": "healthy", "status_label": "Healthy", "current_stock": 310, "days_of_stock": "17-21 days", "daily_consumption": 16, "trend": [345, 340, 332, 325, 320, 315, 310], "replenishment_history": [{"date": "Aug 26", "quantity": "200 units", "status": "Delivered"}], "last_updated": "Yesterday", "data_reliability": "Verified"},
    },
    "paracetamol": {
        "fac-a": {"status": "healthy", "status_label": "Healthy", "current_stock": 1200, "days_of_stock": "24-28 days", "daily_consumption": 46, "trend": [1300, 1280, 1260, 1245, 1230, 1215, 1200], "replenishment_history": [{"date": "Sep 04", "quantity": "800 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-b": {"status": "healthy", "status_label": "Healthy", "current_stock": 580, "days_of_stock": "18-22 days", "daily_consumption": 28, "trend": [640, 630, 620, 610, 600, 590, 580], "replenishment_history": [{"date": "Aug 27", "quantity": "400 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-c": {"status": "healthy", "status_label": "Healthy", "current_stock": 610, "days_of_stock": "19-23 days", "daily_consumption": 29, "trend": [670, 660, 650, 640, 630, 620, 610], "replenishment_history": [{"date": "Aug 21", "quantity": "400 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-d": {"status": "healthy", "status_label": "Healthy", "current_stock": 1420, "days_of_stock": "20-25 days", "daily_consumption": 62, "trend": [1550, 1520, 1500, 1475, 1450, 1435, 1420], "replenishment_history": [{"date": "Sep 06", "quantity": "1000 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
        "fac-e": {"status": "healthy", "status_label": "Healthy", "current_stock": 540, "days_of_stock": "18-21 days", "daily_consumption": 27, "trend": [600, 590, 580, 570, 560, 550, 540], "replenishment_history": [{"date": "Aug 23", "quantity": "350 units", "status": "Delivered"}], "last_updated": "Yesterday", "data_reliability": "Verified"},
        "fac-f": {"status": "healthy", "status_label": "Healthy", "current_stock": 420, "days_of_stock": "17-20 days", "daily_consumption": 22, "trend": [465, 455, 448, 440, 432, 426, 420], "replenishment_history": [{"date": "Aug 31", "quantity": "250 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Verified"},
    },
    "measles": {
        "fac-a": {"status": "healthy", "status_label": "Healthy", "current_stock": 160, "days_of_stock": "20-24 days", "daily_consumption": 7, "trend": [175, 172, 169, 166, 164, 162, 160], "replenishment_history": [{"date": "Sep 01", "quantity": "100 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Cold Chain Ok"},
        "fac-b": {"status": "healthy", "status_label": "Healthy", "current_stock": 90, "days_of_stock": "16-19 days", "daily_consumption": 5, "trend": [102, 100, 97, 95, 93, 91, 90], "replenishment_history": [{"date": "Aug 24", "quantity": "60 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Cold Chain Ok"},
        "fac-c": {"status": "healthy", "status_label": "Healthy", "current_stock": 110, "days_of_stock": "18-22 days", "daily_consumption": 5, "trend": [122, 120, 118, 115, 113, 111, 110], "replenishment_history": [{"date": "Aug 17", "quantity": "80 units", "status": "Delivered"}], "last_updated": "Yesterday", "data_reliability": "Cold Chain Ok"},
        "fac-d": {"status": "healthy", "status_label": "Healthy", "current_stock": 230, "days_of_stock": "19-23 days", "daily_consumption": 11, "trend": [255, 250, 245, 240, 236, 232, 230], "replenishment_history": [{"date": "Sep 09", "quantity": "150 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Cold Chain Ok"},
        "fac-e": {"status": "healthy", "status_label": "Healthy", "current_stock": 95, "days_of_stock": "17-20 days", "daily_consumption": 5, "trend": [108, 105, 103, 100, 98, 96, 95], "replenishment_history": [{"date": "Aug 29", "quantity": "70 units", "status": "Delivered"}], "last_updated": "Today", "data_reliability": "Cold Chain Ok"},
        "fac-f": {"status": "healthy", "status_label": "Healthy", "current_stock": 85, "days_of_stock": "16-19 days", "daily_consumption": 5, "trend": [96, 94, 92, 90, 88, 86, 85], "replenishment_history": [{"date": "Aug 20", "quantity": "50 units", "status": "Delivered"}], "last_updated": "Yesterday", "data_reliability": "Cold Chain Ok"},
    },
}

# Working mutable copy for in-memory demo operations.
facility_inventory = {
    med: {f_id: dict(data) for f_id, data in facs.items()}
    for med, facs in INITIAL_FACILITY_INVENTORY.items()
}

# Regional alerts state for Udupi.
REGIONAL_ALERTS: Dict[str, Dict[str, Any]] = {
    "oxytocin": {
        "id": "alert-oxy-udupi",
        "medicine_id": "oxytocin",
        "medicine_name": "Oxytocin Injection",
        "title": "Regional Shortage Signal Detected",
        "headline": "⚠ Regional Shortage Signal: Oxytocin Injection - 4 of 6 facilities in Udupi Taluk trending toward stockout.",
        "subtext": "4 of 6 facilities in Udupi Taluk show declining stock with no matching replenishment",
        "severity": "high_regional",
        "jurisdiction": "Udupi Taluk, District Health View",
        "affected_count": 4,
        "total_facilities": 6,
        "affected_facilities": ["fac-b", "fac-c", "fac-d", "fac-e"],
        "critical_facilities": ["fac-d"],
        "suggestion_id": "sug-oxy-udupi-01",
        "status": "active",
        "is_mitigated": False,
    }
}

# Redistribution suggestions state for Udupi.
REDISTRIBUTION_SUGGESTIONS: Dict[str, Dict[str, Any]] = {
    "oxytocin": {
        "id": "sug-oxy-udupi-01",
        "medicine_id": "oxytocin",
        "medicine_name": "Oxytocin Injection",
        "from_facility": {
            "id": "fac-a",
            "name": "Brahmavar Community Health Centre",
            "type": "Community Health Centre",
            "locality": "Brahmavar",
            "status": "Surplus",
            "stock_remaining": "18 days stock remaining",
            "current_stock": 380,
            "post_transfer_stock": 230,
            "post_transfer_days": "12-14 days",
        },
        "to_facility": {
            "id": "fac-d",
            "name": "District Hospital Ajjarkad",
            "type": "District Hospital",
            "locality": "Ajjarkad, Udupi",
            "status": "Critical",
            "stock_remaining": "1 day stock remaining",
            "current_stock": 45,
            "post_transfer_stock": 195,
            "post_transfer_days": "7-9 days (150 arriving)",
        },
        "distance_text": "14 km apart - estimated 24 min transfer via NH 66",
        "quantity": 150,
        "quantity_unit": "units",
        "rationale": "High-volume delivery hospital deficit mitigated using buffer stock from Brahmavar CHC without compromising CHC 14-day safety threshold.",
        "status": "pending",
    }
}

@app.get("/medicines")
def get_medicines() -> List[Dict[str, Any]]:
    """Return catalog of monitored medicines."""
    return MEDICINES

@app.get("/facilities")
def get_facilities(medicine_id: str = "oxytocin") -> List[Dict[str, Any]]:
    """Return facilities with current status and geo coordinates for the selected medicine."""
    med_key = medicine_id.lower()
    med_inv = facility_inventory.get(med_key, facility_inventory["oxytocin"])
    
    result = []
    for fac in FACILITY_METADATA:
        fid = fac["id"]
        inv = med_inv.get(fid, {})
        result.append({
            "id": fid,
            "name": fac["name"],
            "type": fac["type"],
            "taluk": fac["taluk"],
            "locality": fac["locality"],
            "lat": fac["lat"],
            "lng": fac["lng"],
            "distance_to_d_km": fac["distance_to_d_km"],
            "travel_time_min": fac["travel_time_min"],
            "status": inv.get("status", "healthy"),
            "status_label": inv.get("status_label", "Healthy"),
            "current_stock": inv.get("current_stock", 0),
            "days_of_stock": inv.get("days_of_stock", "14+ days"),
            "incoming_transfer": inv.get("incoming_transfer", None),
        })
    return result

@app.get("/facilities/{facility_id}")
def get_facility_detail(facility_id: str, medicine_id: str = "oxytocin") -> Dict[str, Any]:
    """Return detailed facility metrics and history for the selected medicine."""
    fac = next((f for f in FACILITY_METADATA if f["id"] == facility_id), None)
    if not fac:
        raise HTTPException(status_code=404, detail="Facility not found")

    med_key = medicine_id.lower()
    med_inv = facility_inventory.get(med_key, facility_inventory["oxytocin"])
    inv = med_inv.get(facility_id, {})
    medicine = next((m for m in MEDICINES if m["id"] == med_key), MEDICINES[0])

    return {
        "id": fac["id"],
        "name": fac["name"],
        "type": fac["type"],
        "taluk": fac["taluk"],
        "locality": fac["locality"],
        "lat": fac["lat"],
        "lng": fac["lng"],
        "medicine_id": med_key,
        "medicine_name": medicine["name"],
        "medicine_unit": medicine["unit"],
        "status": inv.get("status", "healthy"),
        "status_label": inv.get("status_label", "Healthy"),
        "current_stock": inv.get("current_stock", 0),
        "days_of_stock": inv.get("days_of_stock", "14+ days"),
        "daily_consumption": inv.get("daily_consumption", 10),
        "trend": inv.get("trend", [100, 95, 90, 85, 80, 75, 70]),
        "replenishment_history": inv.get("replenishment_history", []),
        "last_updated": inv.get("last_updated", "Recent"),
        "data_reliability": inv.get("data_reliability", "Verified"),
        "incoming_transfer": inv.get("incoming_transfer", None),
    }

@app.get("/alerts")
def get_alerts(medicine_id: str = "oxytocin") -> Optional[Dict[str, Any]]:
    """Return active regional shortage alert for the selected medicine if one exists."""
    med_key = medicine_id.lower()
    return REGIONAL_ALERTS.get(med_key, None)

@app.get("/redistribution-suggestion")
def get_redistribution_suggestion(medicine_id: str = "oxytocin") -> Optional[Dict[str, Any]]:
    """Return AI redistribution recommendation for the selected medicine."""
    med_key = medicine_id.lower()
    return REDISTRIBUTION_SUGGESTIONS.get(med_key, None)

@app.post("/redistribution-suggestion/approve")
def approve_redistribution(payload: ApproveTransferRequest) -> Dict[str, Any]:
    """Approve proposed stock redistribution and update in-memory facility state."""
    transfer_id = payload.transfer_id
    suggestion = None
    target_med = None

    for med, sug in REDISTRIBUTION_SUGGESTIONS.items():
        if sug["id"] == transfer_id:
            suggestion = sug
            target_med = med
            break

    if not suggestion:
        raise HTTPException(status_code=404, detail="Transfer suggestion not found")

    suggestion["status"] = "approved"

    # Update recipient facility (District Hospital Ajjarkad).
    to_fac_id = suggestion["to_facility"]["id"]
    from_fac_id = suggestion["from_facility"]["id"]
    qty = suggestion["quantity"]

    inv_to = facility_inventory[target_med][to_fac_id]
    inv_to["status"] = "in_transit"
    inv_to["status_label"] = "Transfer En Route"
    inv_to["current_stock"] = inv_to["current_stock"] + qty
    inv_to["days_of_stock"] = "7-9 days (150 in transit)"
    inv_to["incoming_transfer"] = {
        "status": "In Transit",
        "units": qty,
        "from_name": suggestion["from_facility"]["name"],
        "eta": "24 mins",
        "dispatch_id": "TX-2026-UD04",
        "route": "NH 66 Southbound",
    }
    inv_to.setdefault("replenishment_history", []).insert(0, {
        "date": "Today (Live)",
        "quantity": f"{qty} units (Redistribution)",
        "status": "Dispatched (En Route via NH 66)"
    })

    # Update donor facility (Brahmavar CHC).
    inv_from = facility_inventory[target_med][from_fac_id]
    inv_from["current_stock"] = max(0, inv_from["current_stock"] - qty)
    inv_from["days_of_stock"] = "12-14 days"

    # Mark regional alert as mitigated.
    if target_med in REGIONAL_ALERTS:
        REGIONAL_ALERTS[target_med]["is_mitigated"] = True
        REGIONAL_ALERTS[target_med]["status"] = "mitigated"

    return {
        "success": True,
        "message": "Transfer approved - dispatch initiated",
        "transfer_id": transfer_id,
        "facility_updated": to_fac_id,
        "dispatched_units": qty,
        "from_facility": suggestion["from_facility"]["name"],
        "to_facility": suggestion["to_facility"]["name"],
        "eta": "24 mins",
    }

@app.post("/reset-demo")
def reset_demo() -> Dict[str, Any]:
    """Reset in-memory state back to initial seed data for demo reruns."""
    global facility_inventory
    facility_inventory = {
        med: {f_id: dict(data) for f_id, data in facs.items()}
        for med, facs in INITIAL_FACILITY_INVENTORY.items()
    }
    if "oxytocin" in REGIONAL_ALERTS:
        REGIONAL_ALERTS["oxytocin"]["is_mitigated"] = False
        REGIONAL_ALERTS["oxytocin"]["status"] = "active"
    if "oxytocin" in REDISTRIBUTION_SUGGESTIONS:
        REDISTRIBUTION_SUGGESTIONS["oxytocin"]["status"] = "pending"
    return {"success": True, "message": "Demo state reset to initial seed"}
