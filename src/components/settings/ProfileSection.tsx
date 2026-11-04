import { PanelFooter, PanelHeader } from './parts'
import ProfileDetails from './ProfileDetails'
import { useMyProfile } from '../../hooks/useMyProfile'
import Button from '../ui/Button'

export default function ProfileSection({ section }) {
  const hook = useMyProfile()

  return (
    <>
      <PanelHeader title={section.label} blurb={section.blurb} />

      <div className="px-[22px] py-[20px]">
        <ProfileDetails hook={hook} />
      </div>

      <PanelFooter>
        <Button variant="ghost" onClick={hook.discardChanges} disabled={hook.busy}>Cancel</Button>
        <Button
          onClick={hook.saveChanges}
          disabled={hook.busy || hook.loading || !hook.isDirty}
        >
          Save changes
        </Button>
      </PanelFooter>
    </>
  )
}

