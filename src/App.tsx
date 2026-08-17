import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Login'
import Summary from '@/pages/Summary'
import CurrentParameter from '@/pages/CurrentParameter'
import StpListing from '@/pages/StpListing'
import StpDetail from '@/pages/StpDetail'
import GeographicalView from '@/pages/GeographicalView'
import LiveStatus from '@/pages/LiveStatus'
import Contracts from '@/pages/Contracts'
import PenaltyEngine from '@/pages/PenaltyEngine'
import ComplianceStatus from '@/pages/ComplianceStatus'
import ViolationTracking from '@/pages/ViolationTracking'
import ComplianceReport from '@/pages/ComplianceReport'
import DataReportsReadings from '@/pages/DataReportsReadings'
import DataReportsPeriodic from '@/pages/DataReportsPeriodic'
import DataReportsExceedance from '@/pages/DataReportsExceedance'
import DataReportsAvailability from '@/pages/DataReportsAvailability'
import DataReportsTotalized from '@/pages/DataReportsTotalized'
import RemoteCalibration from '@/pages/RemoteCalibration'
import TransactionLogs from '@/pages/TransactionLogs'
import SettingsUserManagement from '@/pages/SettingsUserManagement'
import SettingsRoleManagement from '@/pages/SettingsRoleManagement'
import SettingsSystemPreference from '@/pages/SettingsSystemPreference'
import UserProfile from '@/pages/UserProfile'
import Manpower from '@/pages/Manpower'
import CctvMonitoring from '@/pages/CctvMonitoring'
import Inventory from '@/pages/Inventory'
import CameraTest from './pages/CameraTest'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/current-parameter" element={<CurrentParameter />} />
        <Route path="/stp-listing" element={<StpListing />} />
        <Route path="/stp-detail" element={<StpDetail />} />
        <Route path="/geographical-view" element={<GeographicalView />} />
        <Route path="/live-status" element={<LiveStatus />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/penalty-engine" element={<PenaltyEngine />} />
        <Route path="/compliance-status" element={<ComplianceStatus />} />
        <Route path="/violation-tracking" element={<ViolationTracking />} />
        <Route path="/compliance-report" element={<ComplianceReport />} />
        <Route path="/data-reports/readings" element={<DataReportsReadings />} />
        <Route path="/data-reports/periodic" element={<DataReportsPeriodic />} />
        <Route path="/data-reports/exceedance" element={<DataReportsExceedance />} />
        <Route path="/data-reports/availability" element={<DataReportsAvailability />} />
        <Route path="/data-reports/totalized" element={<DataReportsTotalized />} />
        <Route path="/remote-calibration" element={<RemoteCalibration />} />
        <Route path="/transaction-logs" element={<TransactionLogs />} />
        <Route path="/settings/users" element={<SettingsUserManagement />} />
        <Route path="/settings/roles" element={<SettingsRoleManagement />} />
        <Route path="/settings/system" element={<SettingsSystemPreference />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/manpower" element={<Manpower />} />
        <Route path="/cctv" element={<CctvMonitoring />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/testCamera" element={<CameraTest />} />
      </Routes>
    </BrowserRouter>
  )
}
