import { useState, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Sidebar from './layout/Sidebar'
import Topbar from './layout/Topbar'
import Dashboard from './pages/Dashboard'
import StpManagement from './pages/StpManagement'
import Contracts from './pages/Contracts'
import Compliance from './pages/Compliance'
import Manpower from './pages/Manpower'
import CctvMonitoring from './pages/CctvMonitoring'
import SupportTickets from './pages/SupportTickets'
import SupportTicketsAdmin from './pages/SupportTicketsAdmin'
import LiveDelayOffline from './pages/LiveDelayOffline'
import Inventory from './pages/Inventory'
import ContractsReport from './pages/reports/ContractsReport'
import ComplianceReport from './pages/reports/ComplianceReport'
import ManpowerReport from './pages/reports/ManpowerReport'
import CctvReport from './pages/reports/CctvReport'
import InventoryReport from './pages/reports/InventoryReport'
import TeamManagement from './pages/TeamManagement'
import RemoteCalibration from './pages/RemoteCalibration'
import TransactionLogs from './pages/TransactionLogs'
import Settings from './pages/Settings'
import Login from './pages/Login'
import ComingSoon from './pages/ComingSoon'
import FloatingCctvButton from './components/cctv/FloatingCctvButton'
import { PAGE_TITLES, STP_TAB_PATHS, pageTitle, stpTabPath } from './routes'

const BUILT_PATHS = [
  '/dashboard',
  '/stp-management',
  ...STP_TAB_PATHS,
  '/contracts',
  '/compliance',
  '/manpower',
  '/cctv-monitoring',
  '/support-tickets',
  '/support-tickets-admin',
  '/live-delay-offline',
  '/inventory',
  '/reports/contracts',
  '/reports/compliance',
  '/reports/manpower',
  '/reports/cctv-monitoring',
  '/reports/inventory',
  '/team-management',
  '/remote-calibration',
  '/transaction-logs',
  '/settings',
]

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function LoginRoute() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Login />
}

function AppRoutesInner() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/stp-management" element={<StpManagement />} />
      <Route path="/stp-management/:tab" element={<StpManagement />} />
      <Route path="/contracts" element={<Contracts />} />
      <Route path="/compliance" element={<Compliance />} />
      <Route path="/manpower" element={<Manpower />} />
      <Route path="/cctv-monitoring" element={<CctvMonitoring />} />
      <Route path="/support-tickets" element={<SupportTickets />} />
      <Route path="/support-tickets/:ticketId" element={<SupportTickets />} />
      <Route path="/support-tickets-admin" element={<SupportTicketsAdmin />} />
      <Route path="/support-tickets-admin/:ticketId" element={<SupportTicketsAdmin />} />
      <Route path="/live-delay-offline" element={<LiveDelayOffline />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/reports/contracts" element={<ContractsReport />} />
      <Route path="/reports/compliance" element={<ComplianceReport />} />
      <Route path="/reports/manpower" element={<ManpowerReport />} />
      <Route path="/reports/cctv-monitoring" element={<CctvReport />} />
      <Route path="/reports/inventory" element={<InventoryReport />} />
      <Route path="/team-management" element={<TeamManagement />} />
      <Route path="/remote-calibration" element={<RemoteCalibration />} />
      <Route path="/transaction-logs" element={<TransactionLogs />} />
      <Route path="/settings" element={<Settings />} />
      {Object.entries(PAGE_TITLES)
        .filter(([path]) => !BUILT_PATHS.includes(path))
        .map(([path, name]) => (
          <Route key={path} path={path} element={<ComingSoon title={typeof name === 'string' ? name : path} />} />
        ))}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function Shell() {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()
  const title = pageTitle(pathname)
  const hideCctvFloat =
    pathname === '/cctv-monitoring' || pathname === stpTabPath('CCTV')

  // One chrome for every authenticated page — Figma mountain header on all tabs.
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#EEF8FC]">
      {/* Full-width mountain wash behind header (matches Figma on every screen). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[230px] overflow-hidden"
      >
        <img
          src="/dashboard/hero-mountains.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(189,226,253,0.2)] via-transparent to-[#EEF8FC]" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Topbar title={title} variant="dashboard" />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((v) => !v)}
            variant="dashboard"
          />
          <main className="scroll-thin relative min-w-0 flex-1 overflow-y-auto px-[24px] pb-[16px] pt-[2px]">
            <AppRoutesInner />
          </main>
        </div>
      </div>

      {!hideCctvFloat && <FloatingCctvButton />}
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
