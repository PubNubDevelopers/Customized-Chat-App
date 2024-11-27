'use client'

import Image from 'next/image'
import { useState } from 'react'
import ChatMenuHeader from './chatMenuHeader'
import ChatMenuItem from './chatMenuItem'
import { ChatHeaderActionIcon, PresenceIcon, ToastType, useBreakpoints, useMediaQuery } from '../../types'

export default function ChatSelectionMenu ({
  chatSelectionMenuMinimized,
  setChatSelectionMenuMinimized,
  chat,
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
  setActiveChannel,
  setActiveChannelPinnedMessage,
  updateUnreadMessagesCounts,
  currentUserProfileUrl,
  showUserMessage,
  embeddedDemoConfig = null
}) {
  const [unreadExpanded, setUnreadExpanded] = useState(true)
  const [publicExpanded, setPublicExpanded] = useState(true)
  const [groupsExpanded, setGroupsExpanded] = useState(true)
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true)
  const { isXs, isSm, isMd, isLg, active } = useBreakpoints();
  const [searchChannels, setSearchChannels] = useState('')

  function handleChatSearch (term: string) {
    setSearchChannels(term)
  }

  return (
    <div
      id='chats-menu'
      className={`flex flex-col ${!isLg && 
        chatSelectionMenuMinimized ? 'w-5 min-w-5' : 'lg:min-w-80 lg:w-80 min-w-60 w-60'
      } bg-navy50 py-0 overflow-y-auto overscroll-none ${embeddedDemoConfig != null ? '' : 'mt-[64px]'} pb-6 select-none border-r border-navy-200`}
    >
      <div
        className={`${!isLg && 
          chatSelectionMenuMinimized ? 'flex flex-row' : 'hidden'
        } min-h-screen h-screen bg-sky-950`}
      >
        <div
          className='flex cursor-pointer'
          onClick={e => {setChatSelectionMenuMinimized(!chatSelectionMenuMinimized);setShowThread(false)}}
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
      <div className={`flex flex-col ${!isLg && chatSelectionMenuMinimized ? 'hidden' : 'flex'}`}>
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

            <div>List of Chats</div>






      </div>
    </div>
  )
}
