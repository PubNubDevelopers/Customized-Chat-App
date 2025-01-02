'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Chat, User } from '@pubnub/chat'

import { buildConfig } from './configuration'
import { testUsers, testPublicChannels } from './data/testData'

import Image from 'next/image'
import PersonPicker from './chat/ui-components/personPicker'

export default function Home () {
  const searchParams = useSearchParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildConfiguration: any = buildConfig
  const router = useRouter()
  //const [configTypingIndicator, setConfigTypingIndicator] = useState(false)
  const [publishKey, setPublishKey] = useState(null)
  const [subscribeKey, setSubscribeKey] = useState(null)
  const [publicChannelsAvailable, setPublicChannelsAvailable] = useState(false) //  Only create public channel data on the keyset if enabled
  const [loadMessage, setLoadMessage] = useState('Demo is initializing...')
  const [initialized, setInitialized] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const userArray = testUsers

  useEffect(() => {
    setLoadMessage('No Publish / Subscribe Keys')
    //  1. Check for Runtime configuration
    console.log('checking for runtime config')
    const encodedConfiguration = searchParams.get('configuration')
    if (encodedConfiguration) {
      console.log('Found runtime configuration')
      //setEncodedConfiguration(encodedConfiguration)
      //const decodedConfiguration = atob(encodedConfiguration)
      try {
        const jsonConfig = JSON.parse(atob(encodedConfiguration))
        //setConfigTypingIndicator(jsonConfig['typing_indicator'])
        setPublishKey(jsonConfig['publishKey'])
        setSubscribeKey(jsonConfig['subscribeKey'])
        setPublicChannelsAvailable(jsonConfig['public_channels'])
        return
      } catch {
        //  Unable to parse provided configuration
        console.log('Warning: Unable to parse provided runtime configuration')
      }
    }
    //  2. Check for Build time configuration
    console.log(
      'No runtime configuration found.  Checking for build time config'
    )
    if (buildConfiguration?.publishKey != null) {
      console.log('Found build time config')
      setPublishKey(buildConfiguration.publishKey)
    }
    if (buildConfiguration?.subscribeKey != null) {
      setSubscribeKey(buildConfiguration.subscribeKey)
    }
    if (buildConfiguration?.public_channels != null) {
      setPublicChannelsAvailable(buildConfiguration.public_channels)
    }
    if (buildConfiguration?.app_appearance != null) {
      console.log(buildConfiguration?.app_appearance)
      const isDarkMode = buildConfiguration?.app_appearance == 'dark'
      document
      .getElementById('appRoot')
      ?.classList.toggle('dark', isDarkMode)
    }
  }, [
    searchParams,
    router,
    buildConfiguration.publishKey,
    buildConfiguration.subscribeKey,
    buildConfiguration.public_channels,
    buildConfiguration.app_appearance
  ])

  useEffect(() => {
    async function keysetInit () {
      try {
        const localChat = await Chat.init({
          publishKey: publishKey,
          subscribeKey: subscribeKey,
          userId: 'admin-config'
        })

        const testUser = await localChat.getUser('user-01')

        if (!testUser) {
          //  Test user did not exist on keyset, create users and, optionally, channels
          setLoadMessage(
            'Populating keyset with users (this will take a few seconds)'
          )

          const promises = [] as Promise<User | null | undefined>[]
          for (const testUser of userArray) {
            const tempPromise = localChat
              .getUser(testUser.id)
              .then(returnedUser => {
                if (!returnedUser) {
                  return localChat.createUser(testUser.id, {
                    name: testUser.name,
                    profileUrl: testUser.avatar,
                    email: testUser.email,
                    externalId: testUser.externalId,
                    type: 'member',
                    custom: {
                      location: testUser.location,
                      jobTitle: testUser.jobTitle,
                      currentMood: testUser.currentMood,
                      socialHandle: testUser.socialHandle,
                      timezone: testUser.timezone
                    }
                  })
                }
              })
            if (tempPromise) {
              promises.push(tempPromise)
            }
          }
          await Promise.all(promises)
        }

        const testPublicChannel = await localChat.getChannel(
          testPublicChannels[0].id
        )
        if (!testPublicChannel) {
          if (publicChannelsAvailable) {
            setLoadMessage('Creating Public Channel data')
            for (const channel of testPublicChannels) {
              let newPublicChannel = await localChat.getChannel(channel.id)
              if (!newPublicChannel) {
                newPublicChannel = await localChat.createPublicConversation({
                  channelId: channel.id,
                  channelData: {
                    name: channel.name,
                    description: channel.description,
                    custom: {
                      profileUrl: channel.avatar
                    }
                  }
                })
              } else {
                break
              }
            }
          }
        }

        setInitialized(true)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log(error)
        const errorMsg =
          'Unable to initialize PubNub instance: Are the Pub/Sub keys correct?  Are all configuration options enabled (especially App Context)?'
        console.warn(errorMsg)
        setLoadMessage(errorMsg)
      }
    }
    if (!publishKey) return
    if (!subscribeKey) return
    console.log('publish key: ' + publishKey)
    console.log('subscribe key: ' + subscribeKey)
    setLoadMessage('Initializing Keyset')
    shuffleArray(userArray)
    keysetInit()
  }, [publishKey, subscribeKey, userArray, publicChannelsAvailable])

  function login (userId) {
    setLoggingIn(true)
    router.push(`/chat/?userId=${userId}&${searchParams}`)
  }

  function shuffleArray (array) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  return (
    <main className='flex flex-col min-h-screen size-full gap-8 items-center'>
      {/*
      <div suppressHydrationWarning={true} className=''>
        Value of Typing Indicator (Runtime){' '}
        {configTypingIndicator ? 'Enabled' : 'Disabled'}
      </div>
      <div className=''>
        Value of Typing Indicator (Build){' '}
        {buildConfiguration?.typing_indicator ? 'Enabled' : 'Disabled'}
      </div>
        */}
      <div className='flex flex-col gap-3 m-2 items-center'>
        {!initialized || loggingIn ? (
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
            className='self-center dark:invert'
            width={75}
            height={75}
            priority
          />
        )}
        {!initialized && (
          <div className='text-2xl select-none m-2'>{loadMessage}</div>
        )}
        {initialized && (
          <div className='flex flex-col text-center gap-2'>
            <div className='text-center text-lg font-bold'>
              Log in: Customizable Chat Application
            </div>
            <div className='text-center text-base text-pubnub font-normal'>
              Built with the PubNub Chat SDK for JavaScript and TypeScript.
            </div>

            <div className='text-xs'>Select a user to log in as.  The next page will render with your requested color scheme</div>

            <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2'>
              {userArray.slice(0, 21).map((user, index) => {
                return (
                  <PersonPicker
                    key={index}
                    id={index}
                    name={user.name}
                    avatarUrl={user.avatar}
                    personSelected={key => {
                      login(userArray[key].id)
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
