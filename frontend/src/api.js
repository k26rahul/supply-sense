// API client for SupplySense backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function fetchMedicines() {
  const res = await fetch(`${BASE_URL}/medicines`);
  if (!res.ok) throw new Error('Failed to fetch medicines');
  return res.json();
}

export async function fetchFacilities(medicineId = 'oxytocin') {
  const res = await fetch(`${BASE_URL}/facilities?medicine_id=${encodeURIComponent(medicineId)}`);
  if (!res.ok) throw new Error('Failed to fetch facilities');
  return res.json();
}

export async function fetchFacilityDetail(facilityId, medicineId = 'oxytocin') {
  const res = await fetch(`${BASE_URL}/facilities/${encodeURIComponent(facilityId)}?medicine_id=${encodeURIComponent(medicineId)}`);
  if (!res.ok) throw new Error('Failed to fetch facility detail');
  return res.json();
}

export async function fetchAlerts(medicineId = 'oxytocin') {
  const res = await fetch(`${BASE_URL}/alerts?medicine_id=${encodeURIComponent(medicineId)}`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function fetchRedistributionSuggestion(medicineId = 'oxytocin') {
  const res = await fetch(`${BASE_URL}/redistribution-suggestion?medicine_id=${encodeURIComponent(medicineId)}`);
  if (!res.ok) throw new Error('Failed to fetch suggestion');
  return res.json();
}

export async function approveTransfer(transferId) {
  const res = await fetch(`${BASE_URL}/redistribution-suggestion/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transfer_id: transferId }),
  });
  if (!res.ok) throw new Error('Failed to approve transfer');
  return res.json();
}

export async function resetDemoState() {
  const res = await fetch(`${BASE_URL}/reset-demo`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset demo');
  return res.json();
}
