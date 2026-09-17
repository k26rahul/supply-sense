import React, { useState, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar';
import RegionalAlertBanner from './components/RegionalAlertBanner';
import MapView from './components/MapView';
import FacilityDetailPanel from './components/FacilityDetailPanel';
import RedistributionModal from './components/RedistributionModal';
import Toast from './components/Toast';
import { 
  fetchMedicines, 
  fetchFacilities, 
  fetchFacilityDetail, 
  fetchAlerts, 
  fetchRedistributionSuggestion, 
  approveTransfer, 
  resetDemoState 
} from './api';

export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState('oxytocin');
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [facilityDetail, setFacilityDetail] = useState(null);
  const [alert, setAlert] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', subtext: '' });
  const [activeTransfer, setActiveTransfer] = useState(null);

  // Load medicines once
  useEffect(() => {
    async function init() {
      try {
        const meds = await fetchMedicines();
        setMedicines(meds);
      } catch (err) {
        console.error('Error fetching medicines:', err);
      }
    }
    init();
  }, []);

  // Fetch facilities, alerts, suggestion for selected medicine
  const loadData = useCallback(async (medId) => {
    try {
      const [facs, alertData, sugData] = await Promise.all([
        fetchFacilities(medId),
        fetchAlerts(medId),
        fetchRedistributionSuggestion(medId),
      ]);
      setFacilities(facs);
      setAlert(alertData);
      setSuggestion(sugData);

      // Check if there's an already active transfer
      const facD = facs.find((f) => f.id === 'fac-d');
      if (facD && (facD.status === 'in_transit' || facD.incoming_transfer)) {
        setActiveTransfer(true);
      } else {
        setActiveTransfer(false);
      }

      // If a facility is currently selected, refresh its detail
      if (selectedFacilityId) {
        const detail = await fetchFacilityDetail(selectedFacilityId, medId);
        setFacilityDetail(detail);
      }
    } catch (err) {
      console.error('Error loading data for medicine:', err);
    }
  }, [selectedFacilityId]);

  useEffect(() => {
    loadData(selectedMedicineId);
  }, [selectedMedicineId, loadData]);

  // Handle facility selection on map
  const handleSelectFacility = async (facilityId) => {
    setSelectedFacilityId(facilityId);
    try {
      const detail = await fetchFacilityDetail(facilityId, selectedMedicineId);
      setFacilityDetail(detail);
    } catch (err) {
      console.error('Error fetching facility detail:', err);
    }
  };

  // Handle transfer approval
  const handleApproveTransfer = async (transferId) => {
    setIsApproving(true);
    try {
      const res = await approveTransfer(transferId);
      setIsModalOpen(false);
      setActiveTransfer(true);

      // Refresh facilities and detail
      const [facs, alertData, sugData] = await Promise.all([
        fetchFacilities(selectedMedicineId),
        fetchAlerts(selectedMedicineId),
        fetchRedistributionSuggestion(selectedMedicineId),
      ]);
      setFacilities(facs);
      setAlert(alertData);
      setSuggestion(sugData);

      // Also ensure Facility D is selected to show the updated panel
      setSelectedFacilityId('fac-d');
      const detail = await fetchFacilityDetail('fac-d', selectedMedicineId);
      setFacilityDetail(detail);

      // Trigger success confirmation toast
      setToast({
        isOpen: true,
        message: 'Transfer approved — dispatch initiated',
        subtext: `150 units Oxytocin dispatched from Brahmavar CHC to District Hospital Ajjarkad. Estimated arrival: 24 min via NH 66.`,
      });
    } catch (err) {
      console.error('Error approving transfer:', err);
    } finally {
      setIsApproving(false);
    }
  };

  // Reset demo state back to default seed
  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await resetDemoState();
      setSelectedMedicineId('oxytocin');
      setSelectedFacilityId(null);
      setFacilityDetail(null);
      setActiveTransfer(false);
      await loadData('oxytocin');
      setToast({
        isOpen: true,
        message: 'Demo state reset',
        subtext: 'In-memory telemetry restored to baseline scenario.',
      });
    } catch (err) {
      console.error('Error resetting demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const selectedMed = medicines.find((m) => m.id === selectedMedicineId);
  const selectedMedName = selectedMed ? selectedMed.name : 'Oxytocin Injection';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Top Bar */}
      <TopBar
        medicines={medicines}
        selectedMedicineId={selectedMedicineId}
        onSelectMedicine={setSelectedMedicineId}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* 2. Regional Alert Banner */}
      <RegionalAlertBanner
        alert={alert}
        isMitigated={alert?.is_mitigated}
        onOpenRecommendation={() => setIsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3. Main Map View (left ~65% / 8 columns) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <MapView
            facilities={facilities}
            selectedFacilityId={selectedFacilityId}
            onSelectFacility={handleSelectFacility}
            selectedMedicineName={selectedMedName}
            activeTransfer={activeTransfer}
          />

          {/* Quick Script Guidance Pills for Demo Presenter */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 shadow-2xs">
            <span className="font-semibold text-slate-700">60-Sec Demo Flow:</span>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                1. Select Oxytocin
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-medium">
                2. Click District Hospital Ajjarkad (Pulsing Red)
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                3. Click Alert Banner
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                4. Approve Transfer
              </span>
            </div>
          </div>
        </div>

        {/* 4. Facility Detail Panel (right ~35% / 4 columns) */}
        <div className="lg:col-span-4 min-h-[620px] flex flex-col">
          <FacilityDetailPanel
            facility={facilityDetail}
            medicineName={selectedMedName}
            onTriggerRedistribution={() => setIsModalOpen(true)}
            hasRegionalAlert={Boolean(alert && !alert.is_mitigated)}
          />
        </div>
      </main>

      {/* 5. Redistribution Suggestion Modal */}
      <RedistributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suggestion={suggestion}
        onApprove={handleApproveTransfer}
        isApproving={isApproving}
      />

      {/* 6. Success Confirmation Toast */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        subtext={toast.subtext}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
