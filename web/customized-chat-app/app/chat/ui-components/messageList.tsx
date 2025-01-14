import { roboto } from '@/app/fonts'
import Avatar from './avatar'
import Message from './message'
//import UnreadIndicator from './unreadIndicator'
import Image from 'next/image'
import { PresenceIcon } from '../../types'
import Pin from './icons/pin'
import Settings from './icons/settings'

import { useState, useEffect, useRef } from 'react'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Channel,
  Message as pnMessage,
  Membership,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MixedTextTypedElement,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TimetokenUtils
} from '@pubnub/chat'

export default function MessageList ({
  loaded,
  activeChannel,
  currentUser,
  groupUsers,
  groupMembership,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  messageActionHandler = (a, b) => {},
  updateUnreadMessagesCounts,
  setChatSettingsScreenVisible,
  quotedMessage,
  activeChannelPinnedMessage,
  setActiveChannelPinnedMessage,
  //setShowThread,
  allUsers,
  showUserMessage,
  showUserProfile,
  activeChannelRestrictions,
  activeChannelBackground,
  embeddedDemoConfig,
  appConfiguration,
  colorScheme
}) {
  const MAX_AVATARS_SHOWN = 9
  const [messages, setMessages] = useState<pnMessage[]>([])
  const [currentMembership, setCurrentMembership] = useState<Membership>()
  const [readReceipts, setReadReceipts] = useState()
  //const [pinnedMessageTimetoken, setPinnedMessageTimetoken] = useState('') //  Keep track of if someone else has updated the pinned message
  const messageListRef = useRef<HTMLDivElement>(null)
  const [loadingMessage, setLoadingMessage] = useState('')

  function uniqueById (items) {
    const set = new Set()
    return items.filter(item => {
      const isDuplicate = set.has(item.timetoken)
      set.add(item.timetoken)
      return !isDuplicate
    })
  }

  useEffect(() => {
    if (embeddedDemoConfig != null) return
    if (activeChannel == null) return
    if (groupMembership == null) return
    if (!groupMembership.channel) return
    //if (messages && messages.length > 0) return
    //  UseEffect to handle initial configuration of the Message List including reading the historical messages
    setLoadingMessage(
      `${
        appConfiguration?.message_history
          ? 'Fetching History from Server...'
          : 'Message Persistence Disabled for this Application'
      }`
    )
    async function initMessageList () {
      if (activeChannel.id !== groupMembership.channel.id) {
        //console.log('channel IDs did not match, returning')
        return
      }
      setMessages([])
      setCurrentMembership(groupMembership)
      if (appConfiguration?.message_history) {
        activeChannel.getHistory({ count: 20 }).then(
          async historicalMessagesObj => {
            //console.log(historicalMessagesObj)
            //  Run through the historical messages and set the most recently received one (that we were not the sender of) as read
            if (historicalMessagesObj.messages) {
              if (historicalMessagesObj.messages.length == 0) {
                setLoadingMessage('No messages in this chat yet')
              } else {
                setMessages(() => {
                  return uniqueById([...historicalMessagesObj.messages]) //  Avoid race condition where message was being added twice
                })
                for (
                  let i = historicalMessagesObj.messages.length - 1;
                  i >= 0;
                  i--
                ) {
                  await groupMembership.setLastReadMessageTimetoken(
                    historicalMessagesObj.messages[i].timetoken
                  )
                  updateUnreadMessagesCounts()
                  break
                }
              }
            }
          },
          () => {
            setLoadingMessage(
              "Error: You do not have 'Message Persistence' enabled on your keyset."
            )
          }
        )
      }
    }
    initMessageList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChannel, groupMembership, embeddedDemoConfig])

  useEffect(() => {
    //  UseEffect to stream Read Receipts
    if (!activeChannel) return
    if (embeddedDemoConfig != null) return
    if (activeChannel.type == 'public') return //  Read receipts are not supported on public channels

    activeChannel.streamReadReceipts(receipts => {
      setReadReceipts(receipts)
    })
  }, [activeChannel, embeddedDemoConfig])

  useEffect(() => {
    if (embeddedDemoConfig != null) return
    activeChannel?.streamUpdates(async channelUpdate => {
      if (channelUpdate.custom) {
        const pinnedMessageTimetoken =
          channelUpdate.custom.pinnedMessageTimetoken
        if (!pinnedMessageTimetoken) {
          //  Message was unpinned
          setActiveChannelPinnedMessage(null)
        } else {
          channelUpdate.getMessage(pinnedMessageTimetoken).then(message => {
            setActiveChannelPinnedMessage(message)
          })
        }
      } else {
        setActiveChannelPinnedMessage(null)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChannel, embeddedDemoConfig])

  useEffect(() => {
    //  UseEffect to receive new messages sent on the channel
    if (!activeChannel) return
    if (embeddedDemoConfig != null) return
    if (!currentMembership) return

    return activeChannel.connect(message => {
      currentMembership?.setLastReadMessageTimetoken(message.timetoken)
      setMessages(messages => {
        return uniqueById([...messages, message]) //  Avoid race condition where message was being added twice when the channel was launched with historical messages
      })
    })
  }, [activeChannel, currentMembership, embeddedDemoConfig])

  useEffect(() => {
    //  UseEffect to receive updates to messages such as reactions.  This does NOT include new messages being received on the channel (which is handled by the connect elsewhere)
    if (!messages || messages.length == 0) return
    return pnMessage.streamUpdatesOn(messages, setMessages)
  }, [messages])

  useEffect(() => {
    if (!messageListRef.current) return
    //console.log(messageListRef.current.scrollHeight - messageListRef.current.scrollTop)
    if (
      messageListRef.current.scrollTop != 0 &&
      messageListRef.current.scrollHeight - messageListRef.current.scrollTop >
        900
    ) {
      return //  We aren't scrolled to the bottom
    }
    setTimeout(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current?.scrollHeight
      }
    }, 10) //  Some weird timing issue
  }, [messages])

  {
    if (!activeChannel && embeddedDemoConfig == null)
      return (
        <div
          className={`flex flex-col  ${
            embeddedDemoConfig != null
              ? 'max-h-[750px]'
              : 'min-h-screen h-screen'
          } justify-center items-center w-full`}
        >
          <div className='max-w-96 max-h-96 '>
            <Image
              src='/chat-logo.svg'
              alt='Chat Icon'
              className='mb-4'
              width={200}
              height={200}
              priority
            />
          </div>
          <div className={`flex mb-5 animate-spin ${loaded && 'hidden'}`}>
            <Image
              src='/icons/chat-assets/loading.png'
              alt='Chat Icon'
              className=''
              width={50}
              height={50}
              priority
            />
          </div>
          <div className='text-2xl'>
            {loaded
              ? 'Please create a new message / group or choose a channel'
              : 'Logging In...'}
          </div>
        </div>
      )
  }

  return (
    <div
      className={`flex flex-col ${
        embeddedDemoConfig != null ? 'max-h-[750px] h-[750px]' : 'min-h-screen h-screen'
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
        id='chats-header'
        className='flex flex-row items-center h-16 min-h-16 border select-none'
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
          className={`${roboto.className} text-base font-medium flex flex-row grow justify-center items-center gap-3`}
        >
          {activeChannel?.type == 'public' && (
            <div className='flex flex-row justify-center items-center gap-3'>
              <Avatar
                present={PresenceIcon.NOT_SHOWN}
                avatarUrl={activeChannel.custom.profileUrl}
                appConfiguration={appConfiguration}
              />
              {activeChannel.name}{' '}
              {activeChannel.type == 'public' && <div>(Public)</div>}
            </div>
          )}
          {activeChannel?.type == 'direct' && groupUsers?.length <= 2 && (
            <div className='flex flex-row justify-center items-center gap-3'>
              <div className='flex flex-row -space-x-2.0'>
                {groupUsers?.map((member, index) => (
                  <Avatar
                    key={index}
                    avatarUrl={member.profileUrl}
                    present={
                      member.active || member.id == currentUser.id
                        ? PresenceIcon.ONLINE
                        : PresenceIcon.OFFLINE
                    }
                    appConfiguration={appConfiguration}
                  />
                ))}
              </div>
              1:1 between{' '}
              {groupUsers?.map(
                (member, index) =>
                  `${member.name}${
                    groupUsers.length - 1 != index ? ' and ' : ''
                  }`
              )}
            </div>
          )}
          {activeChannel?.type == 'group' &&
            groupUsers?.length != allUsers?.length && (
              <div className='flex flex-row justify-center items-center gap-3'>
                <div className='flex flex-row -space-x-2.0'>
                  {groupUsers?.map(
                    (member, index) =>
                      index < MAX_AVATARS_SHOWN && (
                        <Avatar
                          key={index}
                          avatarUrl={member.profileUrl}
                          present={
                            member.active || member.id == currentUser.id
                              ? PresenceIcon.ONLINE
                              : PresenceIcon.OFFLINE
                          }
                          appConfiguration={appConfiguration}
                        />
                      )
                  )}
                </div>
                {activeChannel.name} (Private Group)
              </div>
            )}
        </div>

        <div className='flex flex-row'>
          {/* Icons on the top right of a chat screen */}
          {appConfiguration?.message_pin == true && (
            <div className='flex flex-row'>
              {/* Pin with number of pinned messages */}
              <div
                className={`p-2 py-3 ${
                  activeChannelPinnedMessage &&
                  'cursor-pointer rounded-md  hover:ring-1 ring-black dark:ring-white'
                } `}
                onClick={() => {
                  if (!activeChannelPinnedMessage) return
                  if (messageListRef && messageListRef.current) {
                    messageListRef.current.scrollTop = 0
                  }
                }}
                style={{
                  background: `${
                    colorScheme?.app_appearance === 'dark'
                      ? colorScheme?.primaryDark
                      : colorScheme?.primary
                  }`
                }}
              >
                <Pin
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
              <div
                className='flex justify-start items-end rounded min-w-2 my-2 text-sm font-normal'
                style={{
                  color: `${
                    colorScheme?.app_appearance === 'dark'
                      ? colorScheme?.secondaryDark
                      : colorScheme?.secondary
                  }`
                }}
              >
                {activeChannelPinnedMessage ? '1' : '0'}
              </div>
            </div>
          )}
          {(appConfiguration == null ||
            appConfiguration?.edit_channel_details == true) && (
            <div
              className='mx-1 p-3 py-3 cursor-pointer rounded-md hover:ring-1 ring-black dark:ring-white'
              onClick={() => {
                setChatSettingsScreenVisible(true)
              }}
              style={{
                background: `${
                  colorScheme?.app_appearance === 'dark'
                    ? colorScheme?.primaryDark
                    : colorScheme?.primary
                }`
              }}
            >
              <Settings
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
          )}
        </div>
      </div>

      {/* This section hard-codes the bottom of the message list to accommodate the height of the message input Div, whose height will vary depending on whether there is a quoted message displayed or not */}
      {/* Subtract 64 from these figures if there is no header bar (234 / 178 with header and 170 / 114 without header) */}
      <div
        id='chats-bubbles'
        className={`flex flex-col overflow-y-auto pb-8 ${
          quotedMessage
            ? embeddedDemoConfig == null
              ? 'mb-[234px]'
              : 'mb-[180px]'
            : embeddedDemoConfig == null
            ? 'mb-[178px]'
            : 'mb-[114px]'
        }`}
        ref={messageListRef}
      >
        {messages && messages.length == 0 && embeddedDemoConfig == null && (
          <div
            className='flex flex-col items-center justify-center w-full h-screen text-xl select-none gap-4 text-neutral900'
            style={{
              color: activeChannelBackground?.color ?? '#525252'
            }}
          >
            <Image
              src='/chat-logo.svg'
              alt='Chat Icon'
              className=''
              width={100}
              height={100}
              priority
            />
            {loadingMessage}
          </div>
        )}
        {activeChannelRestrictions?.ban == true && (
          <div className='flex flex-col items-center justify-center w-full h-screen text-xl select-none gap-4'>
            <Image
              src='/icons/chat-assets/do_not_disturb.svg'
              alt='Banned'
              className=''
              width={100}
              height={100}
              priority
            />
            You have been Banned from this Conversation{' '}
            {activeChannelRestrictions?.reason &&
              `(${activeChannelRestrictions.reason})`}
          </div>
        )}
        {/* Show the pinned message first if there is one */}
        {activeChannelPinnedMessage &&
          !activeChannelPinnedMessage.deleted &&
          appConfiguration?.message_pin == true && (
            <Message
              key={activeChannelPinnedMessage.timetoken}
              received={currentUser?.id !== activeChannelPinnedMessage.userId}
              avatarUrl={
                activeChannelPinnedMessage.userId === currentUser?.id
                  ? currentUser?.profileUrl
                  : groupUsers?.find(
                      user => user.id === activeChannelPinnedMessage.userId
                    )?.profileUrl
              }
              isOnline={
                activeChannelPinnedMessage.userId === currentUser?.id
                  ? currentUser?.active
                  : groupUsers?.find(
                      user => user.id === activeChannelPinnedMessage.userId
                    )?.active
              }
              readReceipts={readReceipts}
              quotedMessageSender={
                activeChannelPinnedMessage.quotedMessage &&
                (activeChannelPinnedMessage.quotedMessage.userId ===
                currentUser?.id
                  ? currentUser.name
                  : groupUsers?.find(
                      user =>
                        user.id ===
                        activeChannelPinnedMessage.quotedMessage.userId
                    )?.name)
              }
              showReadIndicator={false}
              sender={
                activeChannelPinnedMessage.userId ===
                'PUBNUB_INTERNAL_MODERATOR'
                  ? 'Moderator'
                  : activeChannelPinnedMessage.userId === currentUser?.id
                  ? currentUser?.name
                  : allUsers?.find(
                      user => user.id === activeChannelPinnedMessage.userId
                    )?.name
              }
              pinned={true}
              messageActionHandler={(action, vars) =>
                messageActionHandler(action, vars)
              }
              message={activeChannelPinnedMessage}
              currentUserId={currentUser?.id}
              showUserMessage={showUserMessage}
              showUserProfile={showUserProfile}
              activeChannelBackground={activeChannelBackground}
              appConfiguration={appConfiguration}
              colorScheme={colorScheme}
            />
          )}

        {embeddedDemoConfig?.privateTestMessages?.map((message, index) => {
          return (
            activeChannel?.type == 'group' &&
            appConfiguration?.group_chat == true && (
              <Message
                key={index}
                received={message.received}
                avatarUrl={message.avatarUrl}
                isOnline={message.isOnline}
                readReceipts={embeddedDemoConfig?.readReceipts}
                quotedMessageSender={''}
                showReadIndicator={message.showReadIndicator}
                sender={message.sender}
                pinned={message.pinned}
                messageActionHandler={(action, vars) =>
                  messageActionHandler(action, vars)
                }
                message={message.message}
                currentUserId={message.currentUserId}
                showUserMessage={showUserMessage}
                showUserProfile={showUserProfile}
                activeChannelBackground={activeChannelBackground}
                embeddedDemoConfig={embeddedDemoConfig}
                forceShowActions={message.forceShowActions}
                appConfiguration={appConfiguration}
                colorScheme={colorScheme}
              />
            )
          )
        })}

        {embeddedDemoConfig?.publicTestMessages?.map((message, index) => {
          return (
            activeChannel?.type == 'public' &&
            appConfiguration?.public_channels == true && (
              <Message
                key={index}
                received={message.received}
                avatarUrl={message.avatarUrl}
                isOnline={message.isOnline}
                readReceipts={null}
                quotedMessageSender={''}
                showReadIndicator={false}
                sender={message.sender}
                pinned={message.pinned}
                messageActionHandler={(action, vars) =>
                  messageActionHandler(action, vars)
                }
                message={message.message}
                currentUserId={message.currentUserId}
                showUserMessage={showUserMessage}
                activeChannelBackground={activeChannelBackground}
                embeddedDemoConfig={embeddedDemoConfig}
                forceShowActions={message.forceShowActions}
                appConfiguration={appConfiguration}
                colorScheme={colorScheme}
              />
            )
          )
        })}

        {!(activeChannelRestrictions?.ban == true) &&
          messages.map(message => {
            return (
              <Message
                key={message.timetoken}
                received={currentUser.id !== message.userId}
                avatarUrl={
                  message.userId === currentUser.id
                    ? currentUser.profileUrl
                    : allUsers?.find(user => user.id === message.userId)
                        ?.profileUrl
                }
                isOnline={
                  message.userId === currentUser.id
                    ? currentUser.active
                    : groupUsers?.find(user => user.id === message.userId)
                        ?.active
                }
                readReceipts={readReceipts}
                quotedMessageSender={
                  message.quotedMessage &&
                  (message.quotedMessage.userId === currentUser.id
                    ? currentUser.name
                    : allUsers?.find(
                        user => user.id === message.quotedMessage.userId
                      )?.name)
                }
                showReadIndicator={activeChannel.type !== 'public'}
                sender={
                  message.userId === 'PUBNUB_INTERNAL_MODERATOR'
                    ? 'Moderator'
                    : message.userId === currentUser.id
                    ? currentUser.name
                    : allUsers?.find(user => user.id === message.userId)?.name
                }
                pinned={false}
                messageActionHandler={(action, vars) =>
                  messageActionHandler(action, vars)
                }
                message={message}
                currentUserId={currentUser.id}
                showUserMessage={showUserMessage}
                showUserProfile={showUserProfile}
                mutedOrBanned={
                  activeChannelRestrictions?.mute ||
                  activeChannelRestrictions?.ban
                }
                activeChannelBackground={activeChannelBackground}
                appConfiguration={appConfiguration}
                colorScheme={colorScheme}
              />
            )
          })}
      </div>
    </div>
  )
}
