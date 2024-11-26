'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { roboto } from '@/app/fonts'

import { buildConfig } from './configuration'

import MessageActions from './chat/ui-components/messageActions'
import MessageReaction from './chat/ui-components/messageReaction'

export default function Home () {
  const searchParams = useSearchParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildConfiguration: any = buildConfig
  const [encodedConfiguration, setEncodedConfiguration] = useState('')
  const [configTypingIndicator, setConfigTypingIndicator] = useState(false)
  const [actionsShown, setActionsShown] = useState(false)
  const [emojiPickerShown, setEmojiPickerShown] = useState(false)
  let messageHovered = false
  //let actionsHovered = false
  const received1 = true
  const received2 = false
  const quotedMessage = false
  const messageListRef = useRef<HTMLDivElement>(null)

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

  const handleMessageMouseEnter = e => {
    messageHovered = true
    setActionsShown(true)
  }
  const handleMessageMouseLeave = e => {
    messageHovered = false
    setActionsShown(false)
    setEmojiPickerShown(false)
  }

  function handleMessageActionsEnter () {
    //actionsHovered = true
    setActionsShown(true)
  }

  function handleMessageActionsLeave () {
    //actionsHovered = false
    if (!messageHovered) {
      setActionsShown(false)
    }
  }

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

    {/* Message List */}
    <div className='flex flex-col max-h-screen w-[1000px]'>
    <div
        id='chats-bubbles'
        className={`flex flex-col overflow-y-auto pb-8 ${
          quotedMessage ? 'mb-[234px]' : 'mb-[178px]'
        }`}
        ref={messageListRef}
      >
{/* Message 1 */}
      <div
        className={`${
          roboto.className
        } relative text-base font-normal flex text-black ${
          received1 ? 'bg-neutral-50' : 'bg-[#e3f1fd]'
        } p-4 rounded-b-lg ${
          received1 ? 'rounded-tr-lg' : 'rounded-tl-lg'
        } pb-[${!received1 ? '40px' : '0px'}]`}
        onMouseEnter={handleMessageMouseEnter}
        onMouseMove={handleMessageMouseEnter}
        onMouseLeave={handleMessageMouseLeave}
      >
        This is a received message
        <MessageActions
          received={received1}
          actionsShown={actionsShown}
          emojiPickerShown={emojiPickerShown}
          setEmojiPickerShown={setEmojiPickerShown}
          timetoken={9876543210}
          isPinned={false}
          messageActionsEnter={() => handleMessageActionsEnter()}
          messageActionsLeave={() => handleMessageActionsLeave()}
          emojiClick={(emoji) =>     console.log('clicked: ' + emoji)          }
          replyInThreadClick={
            () => console.log('reply')
            //messageActionHandler(MessageActionsTypes.REPLY_IN_THREAD, message)
          }
          quoteMessageClick={
            () => console.log('quote')
            //messageActionHandler(MessageActionsTypes.QUOTE, message)
          }
          pinMessageClick={() => {
            console.log('pin')
            //messageActionHandler(MessageActionsTypes.PIN, message)
          }}
          showEmojiPickerClick={data => {
            console.log('emoji')
            //messageActionHandler(MessageActionsTypes.SHOW_EMOJI, data)
          }}
        />
      </div>

      <div className='my-12'></div>

{/* Message 2 */}
<div
        className={`${
          roboto.className
        } relative text-base font-normal flex text-black ${
          received2 ? 'bg-neutral-50' : 'bg-[#e3f1fd]'
        } p-4 rounded-b-lg ${
          received2 ? 'rounded-tr-lg' : 'rounded-tl-lg'
        } pb-[${!received2 ? '40px' : '0px'}]`}
        onMouseEnter={handleMessageMouseEnter}
        onMouseMove={handleMessageMouseEnter}
        onMouseLeave={handleMessageMouseLeave}
      >
        This is a sent message
        <MessageActions
          received={received2}
          actionsShown={actionsShown}
          emojiPickerShown={emojiPickerShown}
          setEmojiPickerShown={setEmojiPickerShown}
          timetoken={9876543210}
          isPinned={false}
          messageActionsEnter={() => handleMessageActionsEnter()}
          messageActionsLeave={() => handleMessageActionsLeave()}
          emojiClick={(emoji) =>     console.log('clicked: ' + emoji)          }
          replyInThreadClick={
            () => console.log('reply')
            //messageActionHandler(MessageActionsTypes.REPLY_IN_THREAD, message)
          }
          quoteMessageClick={
            () => console.log('quote')
            //messageActionHandler(MessageActionsTypes.QUOTE, message)
          }
          pinMessageClick={() => {
            console.log('pin')
            //messageActionHandler(MessageActionsTypes.PIN, message)
          }}
          showEmojiPickerClick={data => {
            console.log('emoji')
            //messageActionHandler(MessageActionsTypes.SHOW_EMOJI, data)
          }}
        />
      </div>

      </div>
      </div>

      <MessageReaction
        emoji={'😊'}
        count={2}
        messageTimetoken={9876543210}
        reactionClicked={(emoji, messageTimetoken) =>
          console.log(`emoji=${emoji}, timetoken=${messageTimetoken}`)
        }
      />
    </main>
  )
}
