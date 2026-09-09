import { useSearchParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import SettingsNav from '../components/settings/SettingsNav'
import ProfileSection from '../components/settings/ProfileSection'
import NotificationsSection from '../components/settings/NotificationsSection'
import ThresholdsSection from '../components/settings/ThresholdsSection'
import PreferencesSection from '../components/settings/PreferencesSection'
import SecuritySection from '../components/settings/SecuritySection'
import TeamSection from '../components/settings/TeamSection'
import { settingsSections } from '../data/mockData'

const PANELS = {
  profile: ProfileSection,
  notifications: NotificationsSection,
  thresholds: ThresholdsSection,
  preferences: PreferencesSection,
  security: SecuritySection,
  team: TeamSection,
}

export default function Settings() {
  // section lives in the URL so a settings panel can be linked to directly
  const [params, setParams] = useSearchParams()
  const requested = params.get('section')
  const active = PANELS[requested] ? requested : settingsSections[0].key
  const section = settingsSections.find((s) => s.key === active)
  const Panel = PANELS[active]
  const setActive = (key) => setParams(key === settingsSections[0].key ? {} : { section: key })

  return (
    <div className="flex items-start gap-[15px] pb-[22px] pt-[6px]">
      <Card className="w-[252px] shrink-0">
        <SettingsNav active={active} onChange={setActive} />
      </Card>

      <Card className="min-w-0 flex-1">
        <Panel section={section} />
      </Card>
    </div>
  )
}
