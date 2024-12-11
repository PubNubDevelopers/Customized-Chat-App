import { useState } from 'react'
import { roboto } from '@/app/fonts'
import { User } from '@pubnub/chat'
import Avatar from './avatar'
import Image from 'next/image'
import NewMessageUserRow from './newMessageUserRow'
import NewMessageUserPill from './newMessageUserPill'
import { ToastType, PresenceIcon } from '../../types'

export default function NewMessageGroup ({
  chat,
  currentUser,
  setCreatingNewMessage,
  showUserMessage,
  //sendChatEvent,
  invokeRefresh,
  setActiveChannel
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [newDraftGroupUsers, setNewDraftGroupUsers] = useState<User[]>([
    currentUser
  ])
  const [creationInProgress, setCreationInProgress] = useState(false)

  function handleUserSearch (term: string) {
    setSearchTerm(term)
    if (!chat) return
    chat
      .getUsers({
        limit: 10,
        filter: `name LIKE "*${term}*" || id LIKE "*${term}*"`
      }) //  Could also filter by Profile URL:  || profileUrl LIKE "*${term}*"
      .then(userResults => {
        setSearchResults(userResults.users.filter((user) => (user.id != 'admin-config' && user.id != 'PUBNUB_INTERNAL_MODERATOR')))
      })
  }

  function onSearchResultClicked (newUser: User) {
    const alreadyPresent = newDraftGroupUsers.find(
      user => user.id === newUser.id
    )
    if (alreadyPresent) {
      showUserMessage(
        'User Already Selected',
        `${newUser.name} is already selected for this new group`,
        '',
        ToastType.ERROR
      )
    } else if (newDraftGroupUsers.length >= 10) {
      showUserMessage(
        'Demo Limitation',
        'Though the Chat SDK supports groups of up to 100 members, this demo caps the maximum member count at 10',
        'https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/create#input-1',
        ToastType.ERROR
      )
    } else {
      setNewDraftGroupUsers(newDraftGroupUsers => [
        ...newDraftGroupUsers,
        newUser
      ])
      setSearchTerm('')
    }
  }

  function onRemovePill (removingUserId) {
    const filteredArray = newDraftGroupUsers.filter(
      user => user.id !== removingUserId
    )
    setNewDraftGroupUsers(filteredArray)
  }

  async function createGroup () {
    console.log('CREATE GROUP')
    setCreationInProgress(true)
    //  Call createGroup or direct conversation, depending on which one it is.
    //  Send joined events to all participants to let them know they are in a new group
    //  Set the new group as the active chat session

    let desiredChannelId = ''
    let createdChannel = null
    if (newDraftGroupUsers.length == 2) {
      //  Creating a 1:1 conversation
      const otherUser = newDraftGroupUsers.find(
        user => user.id !== chat.currentUser.id
      )
      const { channel } = await chat.createDirectConversation({
        user: otherUser
      }) //  Accepting defaults for channel ID and channel Data
      desiredChannelId = channel.id
      createdChannel = channel
    } else {

      //  Creating a group conversation
      const randomNewChannelName = 'Group ' + Math.floor(Math.random() * 1000)
      const others = newDraftGroupUsers.filter(
        user => user.id !== chat.currentUser.id
      )
      const { channel } = await chat.createGroupConversation({
        users: others,
        channelData: { name: randomNewChannelName }
      })
      desiredChannelId = channel.id
      createdChannel = channel
    }
    if (createdChannel) {
      console.log('created channel')
      console.log(createdChannel['type'])
      await invokeRefresh(desiredChannelId, createdChannel['type'])
      console.log('setting active channel 1')
      setActiveChannel(createdChannel)
    }
    console.log('set to false')
    setCreatingNewMessage(false)
  }

  return (
    <div className='flex flex-col max-h-screen select-none'>
      <div className='flex flex-col border border-navy-200 min-w-full'>
        <div className='flex flex-row gap-4 py-2'>
          <div
            className={`${roboto.className} flex flex-row items-center px-3 font-medium text-base`}
          >
            <div
              className='cursor-pointer'
              onClick={() => setCreatingNewMessage(false)}
            >
              <Image
                src='/icons/chat-assets/west.svg'
                alt='Send'
                className='m-3'
                width={24}
                height={24}
                priority
              />
            </div>
            New Message / Group
          </div>
          <div
            className={`${roboto.className} flex flex-row items-center justify-center grow gap-4 min-h-10 font-medium text-base text-[#101729]`}
          >
            <div className='flex flex-row -space-x-2.5'>
              {newDraftGroupUsers?.map((user, index) => (
                <Avatar
                  key={index}
                  present={PresenceIcon.NOT_SHOWN}
                  avatarUrl={
                    user.profileUrl
                      ? user.profileUrl
                      : '/avatars/placeholder.png'
                  }
                  border={true}
                  width={36}
                  height={36}
                  appConfiguration={null}
                />
              ))}
            </div>
            <div className='flex flex-row gap-2'>
              {newDraftGroupUsers?.length == 1
                ? 'Please Choose some friends'
                : newDraftGroupUsers?.length == 2
                ? 'New Direct Conversation'
                : 'New Private Group'}
            </div>
          </div>
        </div>

        <div className='px-6 py-2 w-2/3'>
          <input
            className='flex w-full rounded-md bg-white border h-12 px-6 border-neutral-300 shadow-sm text-sm focus:ring-1 focus:ring-inputring outline-none placeholder:text-neutral-600'
            placeholder='Search by name'
            value={searchTerm}
            onChange={e => {
              handleUserSearch(e.target.value)
            }}
          />
        </div>

        {/* Search Results */}
        {searchTerm.length > 0 && (
          <div className='px-6 w-full'>
            <div className='relative px-6 w-full'>
              <div className='flex flex-col absolute w-2/5 bg-white rounded-lg border border-neutral-100 shadow-lg left-[0px] top-[0px] z-10'>
                {/* Search Results */}

                {searchResults?.map((user, index) => (
                  <NewMessageUserRow
                    key={index}
                    user={user}
                    present={
                      user.active ? PresenceIcon.ONLINE : PresenceIcon.OFFLINE
                    }
                    clickAction={user => onSearchResultClicked(user)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className='flex flex-wrap px-6 mb-2 w-full bg-white '>
          {newDraftGroupUsers?.map((user, index) => (
            <NewMessageUserPill
              key={index}
              user={user}
              isMe={user.id == chat.currentUser.id}
              removePillAction={userId => onRemovePill(userId)}
            />
          ))}
        </div>
      </div>
      <div
        className={`${
          newDraftGroupUsers.length < 2 ? 'hidden' : 'flex'
        } flex-row justify-end mt-3`}
      >
        <div
          className={`${roboto.className} flex flex-row`}
          onClick={() => createGroup()}
        >
          <div
            className={`${
              creationInProgress && 'hidden'
            } flex justify-between items-center font-medium text-sm px-6 mx-2.5 h-10 cursor-pointer rounded-lg bg-pubnubbabyblue`}
          >
            Create
          </div>
          <div
            className={`${
              !creationInProgress ? 'hidden' : 'flex'
            }  w-[40px] h-[40px] animate-spin mr-3`}
          >
            <Image
              src='/icons/chat-assets/loading.png'
              alt='Chat Icon'
              className=''
              width={40}
              height={40}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
