'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { roboto } from '@/app/fonts'

import { buildConfig } from './configuration'


export default function Home () {
  const searchParams = useSearchParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildConfiguration: any = buildConfig
  const [encodedConfiguration, setEncodedConfiguration] = useState('')
  const [configTypingIndicator, setConfigTypingIndicator] = useState(false)

  useEffect(() => {
    const encodedConfiguration = searchParams.get('configuration')
    if (!encodedConfiguration) return
    setEncodedConfiguration(encodedConfiguration)
  }, [searchParams])

  useEffect(() => {
    if (!encodedConfiguration) return
    try {
      //console.log(encodedConfiguration)
      const decodedConfiguration = atob(encodedConfiguration)
      console.log(decodedConfiguration)
      const jsonConfig = JSON.parse(atob(encodedConfiguration))
      setConfigTypingIndicator(jsonConfig['typing_indicator'])
      console.log(jsonConfig['typing_indicator'])
    } catch {
      //  JSON Parse error
      console.log(
        'Unable to parse configuration search param (expected base64 encoded JSON file)'
      )
    }
  }, [encodedConfiguration])



  return (
    <main className='flex flex-col gap-8 items-center'>
      <div suppressHydrationWarning={true} className=''>
        Value of Typing Indicator (Runtime){' '}
        {configTypingIndicator ? 'Enabled' : 'Disabled'}
      </div>
      <div className=''>
        Value of Typing Indicator (Build){' '}
        {buildConfiguration.typing_indicator ? 'Enabled' : 'Disabled'}
      </div>


    </main>
  )
}
