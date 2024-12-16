import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { roboto } from '@/app/fonts'

import Avatar from './avatar'
import ForwardMessageSearchResult from './forwardMessageSearchResult'
import ForwardMessagePill from './forwardMessagePill'
import {
  PresenceIcon,
  giveUserAvatarUrl,
  giveGroupAvatarUrl,
  givePublicAvatarUrl,
  giveUserName,
  findIndex
} from '../../types'

export default function ModalForwardMessage ({
  chat,
  message,
  currentUserId,
  currentUserProfileUrl,
  publicChannels,
  privateGroups,
  directChats,
  directChatsUsers,
  forwardAction,
  forwardMessageModalVisible,
  setForwardMessageModalVisible
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResultsChannels, setSearchResultsChannels] = useState<Channel[]>(
    []
  )
  const [searchResultsUsers, setSearchResultsUsers] = useState<User[]>([])
  const [forwardMessageChannel, setForwardMessageChannel] =
    useState<Channel | null>(null)

  const [messageRecipientChannels, setMessageRecipientChannels] = useState<
    Channel[]
  >([])
  const [messageRecipientUsers, setMessageRecipientUsers] = useState<User[]>([])

  useEffect(() => {
    if (!chat) return
    if (!message) return
    chat.getChannel(message.channelId).then(ch => {
      setForwardMessageChannel(ch)
    })
  }, [chat, message])

  function handleUserSearch (term: string) {
    setSearchTerm(term)
    if (!chat) return
    setSearchResultsChannels([])
    if (publicChannels) {
      for (const publicChannel of publicChannels) {
        if (publicChannel.name.toLowerCase().indexOf(term.toLowerCase()) > -1) {
          setSearchResultsChannels(searchResultsChannels => [
            ...searchResultsChannels,
            publicChannel
          ])
        }
      }
    }
    if (privateGroups) {
      for (const privateChannel of privateGroups) {
        if (privateChannel.name.toLowerCase().indexOf(term.toLowerCase()) > -1) {
          setSearchResultsChannels(searchResultsChannels => [
            ...searchResultsChannels,
            privateChannel
          ])
        }
      }
    }
    chat
      .getUsers({
        limit: 5,
        filter: `name LIKE "*${term}*"`
      })
      .then(userResults => {
        setSearchResultsUsers(
          userResults.users.filter(
            user =>
              user.id != 'admin-config' &&
              user.id != 'PUBNUB_INTERNAL_MODERATOR' &&
              user.id != currentUserId
          )
        )
      })
  }

  function onSearchResultClickedUser (newUser: User) {
    const alreadyPresent = messageRecipientUsers.find(
      user => user.id === newUser.id
    )
    if (!alreadyPresent) {
      setMessageRecipientUsers(messageRecipientUsers => [
        ...messageRecipientUsers,
        newUser
      ])
    }
    setSearchTerm('')
  }

  function onSearchResultClickedChannel (newChannel: Channel) {
    const alreadyPresent = messageRecipientChannels.find(
      channel => channel.id === newChannel.id
    )
    if (!alreadyPresent) {
      setMessageRecipientChannels(messageRecipientChannels => [
        ...messageRecipientChannels,
        newChannel
      ])
    }
    setSearchTerm('')
  }

  function onRemovePillUser (removingUserId) {
    const filteredArray = messageRecipientUsers.filter(
      user => user.id !== removingUserId
    )
    setMessageRecipientUsers(filteredArray)
  }

  function onRemovePillChannel (removingChannelId) {
    const filteredArray = messageRecipientChannels.filter(
      channel => channel.id !== removingChannelId
    )
    setMessageRecipientChannels(filteredArray)
  }

  function closeModal () {
    setSearchTerm('')
    setMessageRecipientChannels([])
    setMessageRecipientUsers([])
    setForwardMessageModalVisible(false)
  }

  return (
    <div
      className={`${
        !forwardMessageModalVisible && 'hidden'
      } fixed mx-auto inset-0 flex justify-center items-center z-40 select-none`}
    >
      <div className='flex flex-col lg:w-1/2 md:w-2/3 sm:w-2/3 shadow-xl rounded-xl bg-white border border-neutral-300'>
        <div className='flex flex-row justify-end'>
          <div
            className=' cursor-pointer'
            onClick={() => {
              closeModal()
            }}
          >
            <Image
              src='/icons/chat-assets/close.svg'
              alt='Close'
              className='m-3'
              width={24}
              height={24}
              priority
            />
          </div>
        </div>
        <div className='flex flex-col px-12 pb-12 gap-3'>
          <div className='flex font-semibold text-lg justify-center text-neutral-900 mb-2'>
            Forward Message
          </div>

          <div className='flex flex-col gap-1 my-4'>
            <div className='flex font-normal text-sm text-neutral-900'></div>
            <div className='flex flex-col'>
              {' '}
              <input
                className='flex w-full rounded-md bg-white border h-12 px-6 border-neutral-300 shadow-sm text-sm focus:ring-1 focus:ring-inputring outline-none placeholder:text-neutral-600'
                placeholder='Where would you like to forward it?'
                value={searchTerm}
                ref={inputRef}
                onChange={e => {
                  handleUserSearch(e.target.value)
                }}
              />
              {/* Search Results */}
              {searchTerm.length > 0 && (
                <div className='px-6 w-full'>
                  <div className='relative px-6 w-full'>
                    <div className='flex flex-col absolute w-2/5 bg-white rounded-lg border border-neutral-100 shadow-lg left-[0px] top-[0px] z-10'>
                      {/* Search Results */}

                      {searchResultsChannels?.map((channel, index) => (
                        <ForwardMessageSearchResult
                          key={index}
                          avatarUrl={
                            channel?.type === 'group'
                              ? giveGroupAvatarUrl(currentUserProfileUrl)
                              : channel?.type == 'public'
                              ? givePublicAvatarUrl(channel)
                              : '/avatars/placeholder.png'
                          }
                          text={channel.name}
                          clickAction={() =>
                            onSearchResultClickedChannel(channel)
                          }
                        ></ForwardMessageSearchResult>
                      ))}
                      {searchResultsUsers?.map((user, index) => (
                        <ForwardMessageSearchResult
                          key={index}
                          avatarUrl={
                            user.profileUrl ?? '/avatars/placeholder.png'
                          }
                          text={user.name}
                          clickAction={() => onSearchResultClickedUser(user)}
                        ></ForwardMessageSearchResult>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className='flex flex-wrap my-2 w-full bg-white '>
                {messageRecipientUsers?.map((user, index) => (
                  <ForwardMessagePill
                    key={index}
                    id={user.id}
                    text={user.name}
                    isMe={user.id == chat.currentUser.id}
                    removePillAction={userId => onRemovePillUser(userId)}
                  />
                ))}
                {messageRecipientChannels?.map((channel, index) => (
                  <ForwardMessagePill
                    key={index}
                    id={channel.id}
                    text={channel.name}
                    removePillAction={channelId =>
                      onRemovePillChannel(channelId)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='flex flex-col font-normal text-base justify-start border-l-2 border-sky-950 p-2.5 text-neutral-600'>
            <div className='flex flex-row gap-1.5 items-center mb-2'>
              <Avatar
                present={PresenceIcon.NOT_SHOWN}
                avatarUrl={
                  forwardMessageChannel?.type === 'group'
                    ? giveGroupAvatarUrl(currentUserProfileUrl)
                    : forwardMessageChannel?.type == 'public'
                    ? givePublicAvatarUrl(forwardMessageChannel)
                    : forwardMessageChannel?.type == 'direct' && directChats
                    ? giveUserAvatarUrl(
                        directChatsUsers[
                          findIndex(directChats, forwardMessageChannel?.id)
                        ],
                        currentUserId
                      )
                    : '/avatars/placeholder.png'
                }
                width={25}
                height={25}
                appConfiguration={null}
              />
              <div className=''>
                {forwardMessageChannel?.type === 'direct' && directChats
                  ? giveUserName(
                      directChatsUsers[
                        findIndex(directChats, forwardMessageChannel.id)
                      ],
                      currentUserId
                    )
                  : forwardMessageChannel?.name}
              </div>
            </div>
            {/* Usually you would use message.text but I'm using content here for the embedded demo test data */}
            {message?.text ? message.text : message?.content?.text}
          </div>

          <div className='flex flex-row justify-between'>
            <div
              className={`${roboto.className} flex flex-row justify-center items-center text-navy700 font-normal text-base w-1/3 h-12 cursor-pointer border border-neutral-300 rounded-lg bg-white`}
              onClick={() => {
                closeModal()
              }}
            >
              Cancel
            </div>
            <div
              className={`${roboto.className} flex flex-row justify-center items-center text-neutral-50 font-normal text-base w-1/3 h-12 cursor-pointer shadow-sm rounded-lg bg-navy900`}
              onClick={() => {
                if (
                  messageRecipientUsers.length > 0 ||
                  messageRecipientChannels.length > 0
                ) {
                  forwardAction(messageRecipientChannels, messageRecipientUsers)
                  closeModal()
                } else {
                  inputRef.current?.focus()
                }
              }}
            >
              Forward
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
