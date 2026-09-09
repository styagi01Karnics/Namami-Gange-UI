import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './layout/Sidebar'
import Topbar from './layout/Topbar'
import FloatingCameraButton from './layout/FloatingCameraButton'
import Dashboard from './pages/Dashboard'
import StpManagement from './pages/StpManagement'
import Contracts from './pages/Contracts'
import Compliance from './pages/Compliance'
import Manpower from './pages/Manpower'
import CctvMonitoring from './pages/CctvMonitoring'
import Inventory from './pages/Inventory'
import ContractsReport from './pages/reports/ContractsReport'
import ComplianceReport from './pages/reports/ComplianceReport'
import ManpowerReport from './pages/reports/ManpowerReport'
import CctvReport from './pages/reports/CctvReport'
import InventoryReport from './pages/reports/InventoryReport'
import RemoteCalibration from './pages/RemoteCalibration'
import TransactionLogs from './pages/TransactionLogs'
import Settings from './pages/Settings'
import ComingSoon from './pages/ComingSoon'
import Login from './pages/Login'
import { PAGE_TITLES } from './routes'

const BUILT_PATHS = [
  '/dashboard',
  '/stp-management',
  '/contracts',
  '/compliance',
  '/manpower',
  '/cctv-monitoring',
  '/inventory',
  '/reports/contracts',
  '/reports/compliance',
  '/reports/manpower',
  '/reports/cctv-monitoring',
  '/reports/inventory',
  '/remote-calibration',
  '/transaction-logs',
  '/settings',
]

function Shell() {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'Dashboard'

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
      <FloatingCameraButton />

      <main className="scroll-thin flex min-w-0 flex-1 flex-col overflow-y-auto px-[24px]">
        <Topbar title={title} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stp-management" element={<StpManagement />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/manpower" element={<Manpower />} />
          <Route path="/cctv-monitoring" element={<CctvMonitoring />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports/contracts" element={<ContractsReport />} />
          <Route path="/reports/compliance" element={<ComplianceReport />} />
          <Route path="/reports/manpower" element={<ManpowerReport />} />
          <Route path="/reports/cctv-monitoring" element={<CctvReport />} />
          <Route path="/reports/inventory" element={<InventoryReport />} />
          <Route path="/remote-calibration" element={<RemoteCalibration />} />
          <Route path="/transaction-logs" element={<TransactionLogs />} />
          <Route path="/settings" element={<Settings />} />
          {Object.entries(PAGE_TITLES)
            .filter(([path]) => !BUILT_PATHS.includes(path))
            .map(([path, name]) => (
              <Route key={path} path={path} element={<ComingSoon title={name} />} />
            ))}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Shell />} />
      </Routes>
    </BrowserRouter>
  )
}
