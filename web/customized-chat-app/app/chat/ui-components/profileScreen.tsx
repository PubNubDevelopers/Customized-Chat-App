// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Switch } from '@heroui/react'
import Avatar from './avatar'
import { roboto } from '@/app/fonts'
import { ToastType } from '../../types'
import { useState, useEffect } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MoonIcon } from './icons/moonIcon'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SunIcon } from './icons/sunIcon'
import CloseRooms from './icons/closeRooms'
import Logout from './icons/logout'

export default function ProfileScreen ({
  profileScreenVisible,
  setProfileScreenVisible,
  user,
  isMe,
  logout,
  changeName,
  showUserMessage,
  changeUserNameScreenVisible,
  colorScheme,
  setAppDarkMode
}) {
  const [logoutButtonText, setLogoutButtonText] = useState('Log Out')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [darkMode, setDarkMode] = useState(false) //  Light mode by default

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

  function getLastSeenOnline (user) {
    let returnVal = 'Never'
    if (user && user.custom && user.custom.lastActiveTimestamp) {
      const secondsSinceSeen = Math.floor(
        (new Date().getTime() - user.custom.lastActiveTimestamp) / 1000
      )
      const hrs = Math.floor(secondsSinceSeen / 3600)
      const mins = Math.floor((secondsSinceSeen - 3600 * hrs) / 60)
      const secs = secondsSinceSeen % 60
      returnVal = ''
      if (hrs > 0) returnVal += hrs + 'h '
      returnVal += mins + 'm '
      returnVal += secs + 's ago'
    }
    return returnVal
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleSetDarkMode (isDarkMode) {
    setDarkMode(isDarkMode)
    setAppDarkMode(isDarkMode)
  }

  useEffect(() => {
    setDarkMode(colorScheme?.app_appearance === 'dark')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`${
        !profileScreenVisible && 'hidden'
      } flex flex-col h-full p-3 rounded-l-lg select-none fixed right-0 w-96 z-20 border`}
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
        className={`${roboto.className} ${
          changeUserNameScreenVisible && 'opacity-40'
        } text-sm font-medium flex flex-row py-3 items-center`}
      >
        <div
          className='flex cursor-pointer'
          onClick={() => setProfileScreenVisible(false)}
        >
          <CloseRooms
            className='p-3'
            width={36}
            height={36}
            fill={
              colorScheme?.app_appearance === 'dark'
                ? colorScheme?.secondaryDark
                : colorScheme?.secondary
            }
          />
        </div>
        Profile
      </div>

      <div
        className={`flex flex-col ${
          changeUserNameScreenVisible && 'opacity-40'
        }  overflow-y-auto`}
      >
        {
          //  The ability to switch between light and dark modes in this app has
          //  been removed
          /* 
        <div className=''>
          <Switch
          color='default'
              isSelected={darkMode}
              onValueChange={mode => {
                handleSetDarkMode(mode)
              }}
              size='md'
              className='m-2'
              startContent={<SunIcon />}
              endContent={<MoonIcon />}
            >
              <div  style={{
          color: `${
            colorScheme?.app_appearance === 'dark'
              ? colorScheme?.secondaryDark
              : colorScheme?.secondary
          }`
        }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</div>
            </Switch>
        </div>
        */
        }
        <div
          className={`${roboto.className} text-sm font-medium flex flex-row p-3 justify-between items-center`}
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
            colorScheme={colorScheme}
          />
        </div>
        <div className='flex flex-row justify-between items-center py-2 px-4'>
          <div className='flex flex-col'>
            <div className='text-sm'>Name</div>
            <div className='text-lg font-semibold'>{user?.name}</div>
          </div>
          <div
            className={`${roboto.className} ${
              !isMe && 'hidden'
            } flex flex-row justify-between items-center font-medium text-sm px-6 mx-2.5 h-10 cursor-pointer rounded-lg`}
            style={{
              background: `${
                colorScheme?.app_appearance === 'dark'
                  ? colorScheme?.accentDark
                  : colorScheme?.accent
              }`,
              color: `${
                colorScheme?.app_appearance === 'dark'
                  ? colorScheme?.secondaryDark
                  : colorScheme?.secondary
              }`
            }}
            onClick={() => changeName()}
          >
            Change
          </div>
        </div>
        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm'>Email</div>
          <div className='text-lg font-semibold'>{user?.email}</div>
        </div>

        <div className={`${isMe ? 'hidden' : 'flex flex-col py-2 px-4'}`}>
          <div className='text-sm'>Last seen online</div>
          <div className='text-lg font-semibold' suppressHydrationWarning>
            {getLastSeenOnline(user)}
          </div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm'>Location</div>
          <div className='text-lg font-semibold'>{user?.custom?.location}</div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm'>Local Time</div>
          <div className='text-lg font-semibold' suppressHydrationWarning>
            {getLocalTime(user?.custom?.timezone)}
          </div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm'>Job Title</div>
          <div className='text-lg font-semibold'>{user?.custom?.jobTitle}</div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm'>Current Mood</div>
          <div className='text-lg font-semibold'>
            {user?.custom?.currentMood}
          </div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm'>External ID</div>
          <div className='text-lg font-semibold'>{user?.externalId}</div>
        </div>

        <div className='flex flex-col py-2 px-4'>
          <div className='text-sm'>Social Handle</div>
          <div className='text-lg font-semibold'>
            {user?.custom?.socialHandle}
          </div>
        </div>

        {isMe && (
          <div className='pt-3'>
            <div
              className='w-full border mt-4'
              style={{
                borderColor: `${
                  colorScheme?.app_appearance === 'dark'
                    ? colorScheme?.accentDark
                    : colorScheme?.accent
                }`
              }}
            ></div>

            <div
              className={`${roboto.className} flex flex-row justify-center items-center my-6 font-medium text-sm px-4 mx-2.5 h-10 cursor-pointer rounded-lg `}
              style={{
                background: `${
                  colorScheme?.app_appearance === 'dark'
                    ? colorScheme?.accentDark
                    : colorScheme?.accent
                }`,
                color: `${
                  colorScheme?.app_appearance === 'dark'
                    ? colorScheme?.secondaryDark
                    : colorScheme?.secondary
                }`
              }}
              onClick={() => {
                setLogoutButtonText('Please Wait...')
                logout()
              }}
            >
              <Logout
                className='p-3'
                width={40}
                height={40}
                fill={
                  colorScheme?.app_appearance === 'dark'
                    ? colorScheme?.secondaryDark
                    : colorScheme?.secondary
                }
              />
              {logoutButtonText}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
