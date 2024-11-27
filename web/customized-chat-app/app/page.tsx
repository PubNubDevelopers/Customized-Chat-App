'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Chat
} from '@pubnub/chat'

import { buildConfig } from './configuration'
import { testUsers } from './data/testData'

import Image from 'next/image'
import PersonPicker from './ui-components/personPicker'

export default function Home () {
  const searchParams = useSearchParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildConfiguration: any = buildConfig
  const router = useRouter()
  //const [encodedConfiguration, setEncodedConfiguration] = useState('')
  const [configTypingIndicator, setConfigTypingIndicator] = useState(false)
  const [publishKey, setPublishKey] = useState(null)
  const [subscribeKey, setSubscribeKey] = useState(null)
  const [loadMessage, setLoadMessage] = useState('Demo is initializing...')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    setLoadMessage('No Publish / Subscribe Keys')
    //  1. Check for Runtime configuration
    console.log('checking for runtime config')
    const encodedConfiguration = searchParams.get('configuration')
    if (encodedConfiguration) {
      console.log('Found runtime configuration')
      //setEncodedConfiguration(encodedConfiguration)
      const decodedConfiguration = atob(encodedConfiguration)
      try {
        const jsonConfig = JSON.parse(atob(encodedConfiguration))
        setConfigTypingIndicator(jsonConfig['typing_indicator'])
        setPublishKey(jsonConfig['publishKey'])
        setSubscribeKey(jsonConfig['subscribeKey'])
        return
      } catch {
        //  Unable to parse provided configuration
        console.log('Warning: Unable to parse provided configuration')
      }
    }
    //  2. Check for Build time configuration
    console.log('checking for build time config')
    if (buildConfiguration?.publishKey != null) {
      setPublishKey(buildConfiguration.publishKey)
    }
    if (buildConfiguration?.subscribeKey != null) {
      setSubscribeKey(buildConfiguration.subscribeKey)
    }
  }, [searchParams, router])

  useEffect(() => {
    async function keysetInit() {
      console.log('initializing Chat')
      const localChat = await Chat.init({
        publishKey: publishKey,
        subscribeKey: subscribeKey,
        userId: "admin-config"
      })
      console.log(localChat)
  
      await localChat
        .getChannels({ filter: `type == 'public'` })
        .then(async channelsResponse => {
          //  To Do - If this number is 0, create users and channels (also need to define channels in testData.ts)
          console.log('public channel count: ' + channelsResponse.channels.length)
        }
      )

  
  
  
  
  
  
      setInitialized(true)
    }
    if (!publishKey) return
    if (!subscribeKey) return
    console.log(publishKey)
    console.log(subscribeKey)
    setLoadMessage('Initializing Keyset')
    keysetInit()

  }, [publishKey, subscribeKey])

  function login (userId) {
    console.log('person selected: ' + userId)
    router.replace(`/chat/?userId=${userId}&${searchParams}`)
  }

  return (
    <main className='flex flex-col min-h-screen size-full gap-8 items-center'>
      <div suppressHydrationWarning={true} className=''>
        Value of Typing Indicator (Runtime){' '}
        {configTypingIndicator ? 'Enabled' : 'Disabled'}
      </div>
      <div className=''>
        Value of Typing Indicator (Build){' '}
        {buildConfiguration?.typing_indicator ? 'Enabled' : 'Disabled'}
      </div>

      <div className='flex flex-col gap-3 items-center'>
        {!initialized ? (
          <div className='animate-spin'>
            <Image
              src='/icons/chat-assets/loading.png'
              alt='Loading'
              className=''
              width={75}
              height={75}
              priority
            />
          </div>
        ) : (
          <Image
            src='/chat-logo.svg'
            alt='Chat Icon'
            className='self-center'
            width={75}
            height={75}
            priority
          />
        )}
        {!initialized && (
          <div className='text-2xl select-none'>{loadMessage}</div>
        )}
        {initialized && (
          <div className='flex flex-col text-center gap-2'>
            <div className='text-center text-lg text-neutral900 font-bold'>
              Log in: Customizable Chat Application
            </div>
            <div className='text-center text-base text-pubnub font-normal'>
              Built with the PubNub Chat SDK for JavaScript and TypeScript.
            </div>

            <div className='text-xs'>Select a user to log in as</div>

            <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2'>
              {testUsers.slice(0, 21).map((user, index) => {
                return (
                  <PersonPicker
                    key={index}
                    id={index}
                    name={user.name}
                    avatarUrl={user.avatar}
                    personSelected={key => {
                      login(testUsers[key].id)
                    }}
                  ></PersonPicker>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
