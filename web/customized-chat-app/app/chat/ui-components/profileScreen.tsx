import Image from 'next/image'
import Avatar from './avatar'
import { roboto } from '@/app/fonts'
import { ToastType } from '../../types'
import { useState } from 'react'

export default function ProfileScreen ({
  profileScreenVisible,
  setProfileScreenVisible,
  user,
  isMe,
  logout,
  changeName,
  showUserMessage,
  changeUserNameScreenVisible
}) {
  const [logoutButtonText, setLogoutButtonText] = useState('Log Out')

  function getLocalTime (timezone) {
    if (timezone) {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: '' + timezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
      const formatter = new Intl.DateTimeFormat([], options)

      return formatter.format(new Date())
    } else {
      return ''
    }
  }

  function getLastSeenOnline(user) {
    let returnVal = "Never"
    if (user && user.lastActiveTimestamp)
    {
      const secondsSinceSeen = Math.floor(((new Date()).getTime() - user.lastActiveTimestamp) / 1000)
      const hrs = Math.floor(secondsSinceSeen / 3600)
      const mins = Math.floor((secondsSinceSeen - (3600 * hrs)) / 60)
      const secs = secondsSinceSeen % 60
      returnVal = ""
      if (hrs > 0)
        returnVal += hrs + "h "
      returnVal += mins + "m "
      returnVal += secs + "s ago"
    }
    return returnVal
  }

  return (
    <div
      className={`${
        !profileScreenVisible && 'hidden'
      } flex flex-col h-full p-3 rounded-l-lg bg-sky-950 select-none fixed right-0 w-96 z-20`}
    >
      <div
        className={`${roboto.className} ${
          changeUserNameScreenVisible && 'opacity-40'
        } text-sm font-medium flex flex-row text-white py-3 items-center`}
      >
        <div
          className='flex cursor-pointer'
          onClick={() => setProfileScreenVisible(false)}
        >
          <Image
            src='/icons/chat-assets/close-rooms.svg'
            alt='Close Profile'
            className='p-3'
            width={36}
            height={36}
            priority
          />
        </div>
        Profile
      </div>

      <div
        className={`flex flex-col ${
          changeUserNameScreenVisible && 'opacity-40'
        }  overflow-y-auto`}
      >
        <div
          className={`${roboto.className} text-sm font-medium flex flex-row text-white p-3 justify-between items-center`}
        >
          User Profile {isMe && ' (You)'}
        </div>

        <div className='flex justify-center pb-6'>
          <Avatar
            avatarUrl={user?.profileUrl}
            width={88}
            height={88}
            editIcon={isMe}
            editActionHandler={() => {
              showUserMessage(
                'Demo Limitation',
                'Though supported by the Chat SDK, this demo does not support changing your user avatar, unless you use the "User Management" feature of BizOps Workspace',
                'https://www.pubnub.com/docs/bizops-workspace/user-management',
                ToastType.INFO
              )
            }}
            appConfiguration={null}
          />
        </div>
        <div className='flex flex-row justify-between items-center py-2 px-4'>
          <div className='flex flex-col'>
            <div className='text-sm text-white'>Name</div>
            <div className='text-lg text-white font-semibold'>{user?.name}</div>
          </div>
          <div
            className={`${roboto.className} ${
              !isMe && 'hidden'
            } flex flex-row justify-between items-center font-medium text-sm px-6 mx-2.5 h-10 cursor-pointer rounded-lg bg-pubnubbabyblue`}
            onClick={() => changeName()}
          >
            Change
          </div>
        </div>
        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm text-white'>Email</div>
          <div className='text-lg text-white font-semibold'>{user?.email}</div>
        </div>

        <div className={`${isMe ? 'hidden' : 'flex flex-col py-2 px-4'}`}>
          <div className='text-sm text-white'>Last seen online</div>
          <div className='text-lg text-white font-semibold'>{getLastSeenOnline(user)}</div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm text-white'>Location</div>
          <div className='text-lg text-white font-semibold'>
            {user?.custom?.location}
          </div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm text-white'>Local Time</div>
          <div className='text-lg text-white font-semibold'>
            {getLocalTime(user?.custom?.timezone)}
          </div>
        </div>


        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm text-white'>Job Title</div>
          <div className='text-lg text-white font-semibold'>
            {user?.custom?.jobTitle}
          </div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm text-white'>Current Mood</div>
          <div className='text-lg text-white font-semibold'>
            {user?.custom?.currentMood}
          </div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm text-white'>External ID</div>
          <div className='text-lg text-white font-semibold'>
            {user?.externalId}
          </div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm text-white'>Social Handle</div>
          <div className='text-lg text-white font-semibold'>
            {user?.custom?.socialHandle}
          </div>
        </div>

        {isMe && (
          <div className='pt-3'>
            <div className='border border-navy600'></div>

            <div
              className={`${roboto.className} flex flex-row justify-center items-center my-6 text-white font-medium text-sm px-4 mx-2.5 h-10 cursor-pointer border border-[#938F99] rounded-lg bg-sky-950`}
              onClick={() => {
                setLogoutButtonText('Please Wait...')
                logout()
              }}
            >
              <Image
                src='/icons/chat-assets/logout.svg'
                alt='Logout'
                className='p-3'
                width={36}
                height={36}
                priority
              />
              {logoutButtonText}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
