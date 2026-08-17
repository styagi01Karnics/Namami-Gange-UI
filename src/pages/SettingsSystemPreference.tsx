import AppLayout from '@/layouts/AppLayout'
import SettingsTabs from '@/components/SettingsTabs'

/**
 * G1 note: Full frame 592:5928 blocked by Figma View-seat rate limit.
 * Uses Settings shell/tabs from 578:10369 until design context can be re-fetched.
 */
const prefs = [
  { label: 'Email notifications', value: true },
  { label: 'SMS alerts on exceedance', value: true },
  { label: 'Auto refresh (5 min)', value: false },
  { label: 'Dark data table rows', value: false },
  { label: 'Show offline STPs first', value: true },
]

export default function SettingsSystemPreference() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Settings' }]}>
      <section className="overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <SettingsTabs />
        <div className="px-[24px] py-[24px]">
          <h2 className="text-[16px] font-[590] text-[#07121e]">System Preference</h2>
          <div className="mt-[20px] flex flex-col gap-[12px]">
            {prefs.map((pref) => (
              <div
                key={pref.label}
                className="flex items-center justify-between rounded-[8px] border border-[#d8edff] px-[16px] py-[14px]"
              >
                <span className="text-[14px] font-[510] text-[#07121e]">{pref.label}</span>
                <span
                  className={
                    pref.value
                      ? 'relative h-[22px] w-[40px] rounded-full bg-[#0768d2]'
                      : 'relative h-[22px] w-[40px] rounded-full bg-[#d1d5db]'
                  }
                >
                  <span
                    className={
                      pref.value
                        ? 'absolute top-[2px] right-[2px] size-[18px] rounded-full bg-white'
                        : 'absolute top-[2px] left-[2px] size-[18px] rounded-full bg-white'
                    }
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  )
}
