'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import ChatMenuHeader from './chatMenuHeader'
import ChatMenuItem from './chatMenuItem'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  ChatHeaderActionIcon,
  PresenceIcon,
  ToastType,
  useBreakpoints, giveUserAvatarUrl, giveGroupAvatarUrl, givePublicAvatarUrl, giveUserName, findIndex
} from '../../types'

export default function ChatSelectionMenu ({
  chatSelectionMenuMinimized,
  setChatSelectionMenuMinimized,
  chat,
  currentUserId,
  setCreatingNewMessage,
  setShowThread,
  unreadMessages,
  publicChannels,
  publicChannelsMemberships,
  privateGroups,
  privateGroupsUsers,
  privateGroupsMemberships,
  directChats,
  directChatsUsers,
  directChatsMemberships,
  activeChannel,
  setActiveChannelUsers,
  setActiveChannel,
  setActiveChannelPinnedMessage,
  updateUnreadMessagesCounts,
  currentUserProfileUrl,
  showUserMessage,
  appConfiguration,
  embeddedDemoConfig
}) {
  const [unreadExpanded, setUnreadExpanded] = useState(true)
  const [publicExpanded, setPublicExpanded] = useState(true)
  const [groupsExpanded, setGroupsExpanded] = useState(true)
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isXs, isSm, isMd, isLg, active } = useBreakpoints()
  const [searchChannels, setSearchChannels] = useState('')

  const [showUnreadMessageCount, setShowUnreadMessageCount] = useState(true)
  const [showPublicChannels, setShowPublicChannels] = useState(true)
  const [showGroupChat, setShowGroupChat] = useState(true)

  function handleChatSearch (term: string) {
    setSearchChannels(term)
  }

  useEffect(() => {
    if (!appConfiguration) return
    setShowUnreadMessageCount(appConfiguration.message_unread_count == true)
    setShowPublicChannels(appConfiguration.public_channels == true)
    setShowGroupChat(appConfiguration.group_chat == true)
  }, [appConfiguration])

  function giveGroupBubblePrecedent (userArray) {
    return userArray?.map(user => user.id !== currentUserId)
      ? `+${userArray?.map(user => user.id !== currentUserId).length - 1}`
      : ''
  }

  function setActiveChannelAction (channel) {
    if (embeddedDemoConfig != null) {
      if (channel.type == 'public') {
        setActiveChannel(channel)
        setActiveChannelUsers(embeddedDemoConfig.users)
      } else if (channel.type == 'group') {
        setActiveChannel(channel)
        setActiveChannelUsers(embeddedDemoConfig.users.slice(1, 5))
      }
      return
    }
    setCreatingNewMessage(false)
    setActiveChannelPinnedMessage(null)
    setActiveChannel(channel)
  }

  async function markMessageAsRead (
    membershipsArray,
    channelsArray,
    messageChannelId
  ) {
    const index = membershipsArray.findIndex(
      membership => membership.channel.id == messageChannelId
    )
    if (index > -1) {
      const lastMessage = await channelsArray[index]?.getHistory({ count: 1 })
      if (lastMessage && lastMessage.messages) {
        await membershipsArray[index].setLastReadMessage(
          lastMessage.messages[0]
        )
        console.log('setting unread message counts')
        updateUnreadMessagesCounts()
      }
    }
  }

  return (
    <div
      id='chats-menu'
      className={`flex flex-col ${
        !isLg && chatSelectionMenuMinimized
          ? 'w-5 min-w-5'
          : 'lg:min-w-80 lg:w-80 min-w-60 w-60'
      } bg-navy50 py-0 overflow-y-auto overscroll-none ${
        embeddedDemoConfig != null ? '' : 'mt-[64px]'
      } pb-6 select-none border-r border-navy-200`}
    >
      <div
        className={`${
          !isLg && chatSelectionMenuMinimized ? 'flex flex-row' : 'hidden'
        } min-h-screen h-screen bg-sky-950`}
      >
        <div
          className='flex cursor-pointer'
          onClick={() => {
            setChatSelectionMenuMinimized(!chatSelectionMenuMinimized)
            setShowThread(false)
          }}
        >
          <Image
            src='/icons/chat-assets/close-rooms.svg'
            alt='Expand Chats'
            className='p-1 mb-7 rotate-180'
            width={36}
            height={36}
            priority
          />
        </div>
      </div>
      <div
        className={`flex flex-col ${
          !isLg && chatSelectionMenuMinimized ? 'hidden' : 'flex'
        }`}
      >
        <div className={`relative px-4 mt-5`}>
          <input
            id='chats-search-input'
            value={searchChannels}
            className='flex w-full rounded-md bg-navy50 border  border-neutral-400 py-[9px] pl-9 px-[13px] text-sm focus:ring-1 focus:ring-inputring outline-none placeholder:text-neutral-500'
            placeholder='Search'
            onChange={e => {
              handleChatSearch(e.target.value)
            }}
          />
          <Image
            src='/icons/chat-assets/search.svg'
            alt='Search Icon'
            className='absolute left-6 top-1/2 h-[20px] w-[20px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900'
            width={20}
            height={20}
            priority
          />
        </div>

        {showUnreadMessageCount && unreadMessages && unreadMessages.length > 0 && (
          <ChatMenuHeader
            text={`UNREAD`}
            actionIcon={ChatHeaderActionIcon.MARK_READ}
            expanded={unreadExpanded}
            expandCollapse={() => {
              setUnreadExpanded(!unreadExpanded)
            }}
            action={async () => {
              if (embeddedDemoConfig != null) return
              await chat?.markAllMessagesAsRead()
              updateUnreadMessagesCounts()

              showUserMessage(
                'Success:',
                'All messsages have been marked as read, and sent receipts are updated accordingly',
                'https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/unread#mark-messages-as-read-all-channels',
                ToastType.CHECK
              )
            }}
          />
        )}
        {showUnreadMessageCount && unreadExpanded && (
          <div>
            {unreadMessages?.map(
              (unreadMessage, index) =>
                unreadMessage.channel.id !== activeChannel?.id &&
                (
                  (unreadMessage.channel.type === 'direct' && directChats
                    ? directChatsUsers[
                        findIndex(directChats, unreadMessage.channel.id)
                      ]?.find(user => user.id !== currentUserId)?.name
                    : unreadMessage.channel.name) ?? ''
                )
                  .toLowerCase()
                  ?.indexOf(searchChannels.toLowerCase()) > -1 &&
                !(
                  !showPublicChannels && unreadMessage.channel.type == 'public'
                ) &&
                !(!showGroupChat && unreadMessage.channel.type == 'group') &&
                !(!showGroupChat && unreadMessage.channel.type == 'direct') && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={
                      unreadMessage.channel.type === 'group'
                        ? giveGroupAvatarUrl(currentUserProfileUrl)
                        : unreadMessage.channel.type == 'public'
                        ? givePublicAvatarUrl(unreadMessage.channel)
                        : unreadMessage.channel.type == 'direct' && directChats
                        ? giveUserAvatarUrl(
                            directChatsUsers[
                              findIndex(directChats, unreadMessage.channel.id)
                            ], currentUserId
                          )
                        : '/avatars/placeholder.png'
                    }
                    avatarBubblePrecedent={
                      unreadMessage.channel.type === 'group' && privateGroups
                        ? giveGroupBubblePrecedent(
                            privateGroupsUsers[
                              findIndex(privateGroups, unreadMessage.channel.id)
                            ]
                          )
                        : ''
                    }
                    text={
                      unreadMessage.channel.type === 'direct' && directChats
                        ? giveUserName(
                            directChatsUsers[
                              findIndex(directChats, unreadMessage.channel.id)
                            ], currentUserId
                          )
                        : unreadMessage.channel.name
                    }
                    present={PresenceIcon.NOT_SHOWN}
                    count={'' + unreadMessage.count}
                    markAsRead={true}
                    markAsReadAction={async e => {
                      e.stopPropagation()
                      if (embeddedDemoConfig != null) return
                      if (
                        unreadMessage.channel.type === 'public' &&
                        publicChannelsMemberships &&
                        publicChannels
                      ) {
                        await markMessageAsRead(
                          publicChannelsMemberships,
                          publicChannels,
                          unreadMessage.channel.id
                        )
                      } else if (
                        unreadMessage.channel.type === 'group' &&
                        privateGroupsMemberships &&
                        privateGroups
                      ) {
                        await markMessageAsRead(
                          privateGroupsMemberships,
                          privateGroups,
                          unreadMessage.channel.id
                        )
                      } else if (
                        unreadMessage.channel.type === 'direct' &&
                        directChatsMemberships &&
                        directChats
                      ) {
                        await markMessageAsRead(
                          directChatsMemberships,
                          directChats,
                          unreadMessage.channel.id
                        )
                      }
                    }}
                    setActiveChannel={() => {
                      if (
                        unreadMessage.channel.type === 'public' &&
                        publicChannels
                      ) {
                        setActiveChannelAction(
                          publicChannels[
                            findIndex(publicChannels, unreadMessage.channel.id)
                          ]
                        )
                      } else if (
                        unreadMessage.channel.type === 'group' &&
                        privateGroups
                      ) {
                        setActiveChannelAction(
                          privateGroups[
                            findIndex(privateGroups, unreadMessage.channel.id)
                          ]
                        )
                      } else if (
                        unreadMessage.channel.type === 'direct' &&
                        directChats
                      ) {
                        setActiveChannelAction(
                          directChats[
                            findIndex(directChats, unreadMessage.channel.id)
                          ]
                        )
                      }
                    }}
                    appConfiguration={appConfiguration}
                  ></ChatMenuItem>
                )
            )}
          </div>
        )}

        {showUnreadMessageCount == true &&
          unreadMessages &&
          unreadMessages.length > 0 && (
            <div className='w-full border border-navy200 mt-4'></div>
          )}

        {showPublicChannels && (
          <ChatMenuHeader
            text='PUBLIC CHANNELS'
            expanded={publicExpanded}
            expandCollapse={() => {
              setPublicExpanded(!publicExpanded)
            }}
            actionIcon={ChatHeaderActionIcon.ADD}
            action={() => {
              if (embeddedDemoConfig != null) return
              showUserMessage(
                'Demo Limitation:',
                'Although not supported by this demo, you can use the Chat SDK to create new Public Channels',
                'https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/create#create-public-channel',
                ToastType.INFO
              )
            }}
          />
        )}
        {showPublicChannels && publicExpanded && (
          <div>
            {publicChannels?.map(
              (publicChannel, index) =>
                (publicChannel.name ?? '')
                  .toLowerCase()
                  .indexOf(searchChannels.toLowerCase()) > -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={givePublicAvatarUrl(publicChannel)}
                    text={publicChannel.name}
                    present={PresenceIcon.NOT_SHOWN}
                    setActiveChannel={() => {
                      setActiveChannelAction(publicChannels[index])
                    }}
                    appConfiguration={appConfiguration}
                  ></ChatMenuItem>
                )
            )}
          </div>
        )}

        {showPublicChannels && (
          <div className='w-full border border-navy200 mt-4'></div>
        )}

        {showGroupChat && (
          <ChatMenuHeader
            text='PRIVATE GROUPS'
            expanded={groupsExpanded}
            expandCollapse={() => setGroupsExpanded(!groupsExpanded)}
            actionIcon={ChatHeaderActionIcon.ADD}
            action={setCreatingNewMessage}
          />
        )}
        {showGroupChat && groupsExpanded && (
          <div>
            {privateGroups?.map(
              (privateGroup, index) =>
                (privateGroup.name ?? '')
                  .toLowerCase()
                  .indexOf(searchChannels.toLowerCase()) > -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={giveGroupAvatarUrl(currentUserProfileUrl)}
                    text={privateGroup.name}
                    present={PresenceIcon.NOT_SHOWN}
                    avatarBubblePrecedent={giveGroupBubblePrecedent(
                      privateGroupsUsers[index]
                    )}
                    setActiveChannel={() => {
                      setActiveChannelAction(privateGroups[index])
                    }}
                    appConfiguration={appConfiguration}
                  />
                )
            )}
          </div>
        )}

        {showGroupChat && (
          <div className='w-full border border-navy200 mt-4'></div>
        )}
        {showGroupChat && (
          <ChatMenuHeader
            text={`DIRECT MESSAGES`}
            expanded={directMessagesExpanded}
            expandCollapse={() =>
              setDirectMessagesExpanded(!directMessagesExpanded)
            }
            actionIcon={ChatHeaderActionIcon.ADD}
            action={setCreatingNewMessage}
          />
        )}
        {showGroupChat && directMessagesExpanded && (
          <div>
            {directChats?.map(
              (directChat, index) =>
                (
                  directChatsUsers[index]?.find(
                    user => user.id !== currentUserId
                  )?.name ?? ''
                )
                  .toLowerCase()
                  .indexOf(searchChannels.toLowerCase()) > -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={giveUserAvatarUrl(directChatsUsers[index], currentUserId)}
                    text={giveUserName(directChatsUsers[index], currentUserId)}
                    present={
                      directChatsUsers[index]?.find(
                        user => user.id !== currentUserId
                      )?.active
                        ? PresenceIcon.ONLINE
                        : PresenceIcon.OFFLINE
                    }
                    setActiveChannel={() => {
                      setActiveChannelAction(directChats[index])
                    }}
                    appConfiguration={appConfiguration}
                  />
                )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
