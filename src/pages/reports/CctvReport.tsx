import ReportShell from '../../components/reports/ReportShell'
import RecordingDownloadCard from '../../components/cctv/RecordingDownloadCard'

function CctvReportBody() {
  return <RecordingDownloadCard />
}

export default function CctvReport() {
  return (
    <ReportShell>
      <CctvReportBody />
    </ReportShell>
  )
}
