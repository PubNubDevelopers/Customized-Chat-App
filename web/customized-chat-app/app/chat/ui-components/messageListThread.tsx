import Message from './message'
import { roboto } from '@/app/fonts'
import MessageInput from './messageInput'
import { useState, useEffect, useRef } from 'react'
import {
  //Channel,
  //User,
  Message as pnMessage
  //Membership,
  //MixedTextTypedElement,
  //TimetokenUtils
} from '@pubnub/chat'
import Close from './icons/close'

export default function MessageListThread ({
  showThread,
  setShowThread,
  activeThreadChannel,
  activeThreadMessage,
  currentUser,
  groupUsers,
  setChatSelectionMenuMinimized,
  activeChannelBackground,
  embeddedDemoConfig = null,
  appConfiguration,
  colorScheme
}) {
  const [messages, setMessages] = useState<pnMessage[]>([])
  const messageListRef = useRef<HTMLDivElement>(null)

  function uniqueById (items) {
    const set = new Set()
    return items.filter(item => {
      const isDuplicate = set.has(item.timetoken)
      set.add(item.timetoken)
      return !isDuplicate
    })
  }

  useEffect(() => {
    //  UseEffect to handle initial configuration of the thread, including loading historical messages
    if (!activeThreadMessage) return
    if (!activeThreadChannel) return
    async function initThreadMessages () {
      setMessages([])
      activeThreadChannel
        .getHistory({ count: 20 })
        .then(historicalMessagesObj => {
          setMessages(() => {
            return uniqueById([...historicalMessagesObj.messages])
          })
        })
    }
    initThreadMessages()
  }, [activeThreadChannel, activeThreadMessage])

  useEffect(() => {
    //  UseEffect to receive new messages sent to the thread
    if (!activeThreadMessage) return
    if (!activeThreadChannel) return
    return activeThreadChannel.connect(message => {
      setMessages(messages => {
        return uniqueById([...messages, message])
      })
    })
  }, [activeThreadChannel, activeThreadMessage])

  useEffect(() => {
    if (!messageListRef.current) return
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current?.scrollHeight
    }
  }, [messages])

  return (
    <div className='relative'>
      <div
        className={`${
          !showThread && 'hidden'
        } flex flex-col min-w-80 max-w-80 max-h-screen py-0 ${
          embeddedDemoConfig == null ? 'mt-[64px]' : ''
        }`}
        style={{
          backgroundImage:
            activeChannelBackground?.backgroundImage ??
            "url('/backgrounds/default.png')",
          backgroundPosition:
            activeChannelBackground?.backgroundPosition ?? 'initial'
        }}
      >
        <div
          id='threads-header'
          className='flex flex-row items-center w-full h-16 border min-h-16 border-l border-navy-200'
          style={{
            background: `${
              colorScheme?.app_appearance === 'dark'
                ? colorScheme?.primaryDark
                : colorScheme?.primary
            }`,
            color: `${
              colorScheme?.app_appearance === 'dark'
                ? colorScheme?.secondaryDark
                : colorScheme?.secondary
            }`
          }}
        >
          <div
            className={`${roboto.className} text-base font-bold flex grow pl-6 pr-3 justify-between items-center`}
          >
            Reply in thread
            <div
              className='flex cursor-pointer p-3'
              onClick={() => {
                setShowThread(false)
                setChatSelectionMenuMinimized(false)
              }}
            >
              <Close
                className=''
                width={24}
                height={24}
                fill={
                  colorScheme?.app_appearance === 'dark'
                    ? colorScheme?.secondaryDark
                    : colorScheme?.secondary
                }
              />
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col border-x border-navy-200 h-screen overflow-y-auto pb-6 ${
            embeddedDemoConfig == null ? 'mb-[178px]' : 'mb-[114px]'
          }`}
          ref={messageListRef}
        >
          {/* ORIGINAL MESSAGE */}
          {activeThreadMessage && (
            <Message
              key={activeThreadMessage.timetoken}
              received={currentUser.id !== activeThreadMessage.userId}
              inThread={true}
              avatarUrl={
                activeThreadMessage.userId === currentUser.id
                  ? currentUser.profileUrl
                  : groupUsers?.find(
                      user => user.id === activeThreadMessage.userId
                    )?.profileUrl
              }
              readReceipts={null}
              showReadIndicator={false}
              sender={
                activeThreadMessage.userId === activeThreadMessage.id
                  ? currentUser.name
                  : groupUsers?.find(
                      user => user.id === activeThreadMessage.userId
                    )?.name
              }
              pinned={false} //  Chat SDK supports pinning messages in threads, but this demo does not
              messageActionHandler={() => {}}
              message={activeThreadMessage}
              currentUserId={currentUser.id}
              activeChannelBackground={activeChannelBackground}
              appConfiguration={appConfiguration}
              colorScheme={colorScheme}
            />
          )}
          {/* THREAD BUBBLES */}
          {messages.map(message => {
            return (
              <Message
                key={message.timetoken}
                received={currentUser.id !== message.userId}
                inThread={true}
                avatarUrl={
                  message.userId === currentUser.id
                    ? currentUser.profileUrl
                    : groupUsers?.find(user => user.id === message.userId)
                        ?.profileUrl
                }
                readReceipts={null}
                showReadIndicator={false}
                sender={
                  message.userId === currentUser.id
                    ? currentUser.name
                    : groupUsers?.find(user => user.id === message.userId)?.name
                }
                pinned={false}
                messageActionHandler={() => {}}
                message={message}
                currentUserId={currentUser.id}
                activeChannelBackground={activeChannelBackground}
                appConfiguration={appConfiguration}
                colorScheme={colorScheme}
              />
            )
          })}
        </div>

        <div className='absolute bottom-0 left-0 right-0'>
          <MessageInput
            activeChannel={activeThreadChannel}
            replyInThread={true}
            quotedMessage={null}
            quotedMessageSender={''}
            currentlyEditingMessage={null}
            setCurrentlyEditingMessage={() => {}}
            activeChannelRestrictions={null}
            embeddedDemoConfig={embeddedDemoConfig}
            appConfiguration={appConfiguration}
            colorScheme={colorScheme}
          />
        </div>
      </div>
    </div>
  )
}
