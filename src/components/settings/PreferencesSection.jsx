import { useState } from 'react'
import Button from '../ui/Button'
import Field from '../ui/Field'
import Select from '../ui/Select'
import { PanelFooter, PanelHeader } from './parts'
import { preferenceOptions } from '../../data/mockData'

const FIELDS = [
  { key: 'language', label: 'Language' },
  { key: 'timezone', label: 'Timezone' },
  { key: 'dateFormat', label: 'Date format' },
  { key: 'timeFormat', label: 'Time format' },
  { key: 'landingPage', label: 'Default landing page' },
  { key: 'defaultStp', label: 'Default STP' },
  { key: 'rowsPerPage', label: 'Rows per page in tables' },
]

const initial = Object.fromEntries(FIELDS.map((f) => [f.key, preferenceOptions[f.key][0]]))

export default function PreferencesSection({ section }) {
  const [values, setValues] = useState(initial)

  return (
    <>
      <PanelHeader title={section.label} blurb={section.blurb} />

      <div className="grid grid-cols-2 gap-x-[18px] gap-y-[16px] px-[22px] py-[20px]">
        {FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <Select
              options={preferenceOptions[f.key]}
              value={values[f.key]}
              onChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v }))}
            />
          </Field>
        ))}
      </div>

      <PanelFooter>
        <Button variant="ghost" onClick={() => setValues(initial)}>Cancel</Button>
        <Button>Save changes</Button>
      </PanelFooter>
    </>
  )
}
