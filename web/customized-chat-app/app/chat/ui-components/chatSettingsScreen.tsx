import Avatar from './avatar'
import { roboto } from '@/app/fonts'
import Image from 'next/image'
import { useEffect } from 'react'
import CloseRooms from './icons/closeRooms'
import Logout from './icons/logout'
import { Backgrounds } from '../../types'

export default function ChatSettingsScreen ({
  chatSettingsScreenVisible,
  setChatSettingsScreenVisible,
  changeChatNameScreenVisible,
  manageMembersModalVisible,
  isDirectChat,
  activeChannel,
  activeChannelUsers,
  buttonAction,
  changeChatNameAction = () => {},
  manageMembershipsAction = () => {},
  setBackgroundAction,
  embeddedDemoConfig = null,
  appConfiguration,
  colorScheme
}) {
  const MAX_AVATARS_SHOWN = 13

  useEffect(() => {
    if (!chatSettingsScreenVisible) return
  }, [chatSettingsScreenVisible])

  return (
    <div
      className={`${
        !chatSettingsScreenVisible && 'hidden'
      } flex flex-col h-full p-3 rounded-l-lg select-none overflow-y-auto border ${
        embeddedDemoConfig == null ? 'fixed' : 'absolute'
      } right-0 w-96 z-20`}
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
          (changeChatNameScreenVisible || manageMembersModalVisible) &&
          'opacity-40'
        }  text-sm font-medium flex flex-row py-3 items-center`}
      >
        <div
          className={`flex cursor-pointer`}
          onClick={() => setChatSettingsScreenVisible(false)}
        >
          <CloseRooms
            className=''
            width={36}
            height={36}
            fill={colorScheme?.app_appearance === 'dark'
              ? colorScheme?.secondaryDark
              : colorScheme?.secondary}
          />
        </div>
        Chat settings
      </div>

      <div
        className={`${
          (changeChatNameScreenVisible || manageMembersModalVisible) &&
          'opacity-40'
        } `}
      >
        <div
          className={`${roboto.className} text-sm font-medium flex flex-row p-4 justify-between items-center`}
        >
          Settings
        </div>

        <div className='flex flex-col'>
          {/* Avatar(s) */}
          <div className='flex justify-center pb-6'>
            <div className='flex flex-row -space-x-2.5'>
              {activeChannelUsers?.map(
                (member, index) =>
                  index < MAX_AVATARS_SHOWN && (
                    <Avatar
                      key={index}
                      avatarUrl={member.profileUrl}
                      width={88}
                      height={88}
                      appConfiguration={appConfiguration}
                      colorScheme={colorScheme}
                    />
                  )
              )}
            </div>
          </div>

          {/* Chat members for 1:1 chats, or Chat name for Group chats */}
          {isDirectChat ? (
            <div className='flex flex-row justify-between items-center py-4 px-4'>
              <div className='flex flex-col'>
                <div className='text-lg'>Chat members</div>
                {activeChannelUsers?.map((member, index) => (
                  <div className='text-lg font-semibold' key={index}>
                    {member.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='flex flex-row justify-between items-center py-4 px-4'>
              <div className='flex flex-col'>
                <div className='text-lg font-normal'>Chat name</div>
                <div className='text-lg font-semibold'>
                  {activeChannel?.name}
                </div>
              </div>
              <div
                className={`${roboto.className} flex flex-row justify-between items-center font-medium text-sm px-6 mx-2.5 h-10 cursor-pointer rounded-lg `}
                onClick={() => {
                  if (embeddedDemoConfig != null) return
                  changeChatNameAction()
                }}
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
              >
                Change
              </div>
            </div>
          )}

          <div
            className='border'
            style={{
              borderColor: `${
                colorScheme?.app_appearance === 'dark'
                  ? colorScheme?.accentDark
                  : colorScheme?.accent
              }`
            }}
          ></div>

          {!isDirectChat && (
            <div>
              {' '}
              <div className='flex flex-row justify-between items-center py-6 px-4'>
                <div className='text-lg'>Members</div>
                <div
                  className={`${roboto.className} flex flex-row justify-between items-center font-medium text-sm px-6 mx-2.5 h-10 cursor-pointer rounded-lg`}
                  onClick={() => {
                    if (embeddedDemoConfig != null) return
                    manageMembershipsAction()
                  }}
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
                >
                  View
                </div>
              </div>
              <div
                className='border'
                style={{
                  borderColor: `${
                    colorScheme?.app_appearance === 'dark'
                      ? colorScheme?.accentDark
                      : colorScheme?.accent
                  }`
                }}
              ></div>
            </div>
          )}

          <div className='flex flex-col justify-between items-start py-6 px-4 gap-2'>
            <div className='text-lg'>Choose Background</div>
            <div className='text-xs'>Will update for all participants</div>
            {Backgrounds?.map((background, index) => (
              <div key={index} className='cursor-pointer place-items-end'
              onClick={() => {
                setBackgroundAction(background, index)
                setChatSettingsScreenVisible(false)
              }}>
                <Image
                  src={background.url}
                  alt='Background'
                  height={400}
                  width={400}
                  sizes={'300px'}
                  style={{
                    objectFit: 'cover',
                    height: '100px'
                  }}
                />
                  <div className='text-xs my-1 self-end'>{background.name}</div>
              </div>
            ))}
          </div>
          <div
            className='border'
            style={{
              borderColor: `${
                colorScheme?.app_appearance === 'dark'
                  ? colorScheme?.accentDark
                  : colorScheme?.accent
              }`
            }}
          ></div>

          {isDirectChat ? (
            <div
              className={`${roboto.className} flex flex-row justify-center my-6 items-center font-medium text-sm px-4 mx-2.5 h-10 cursor-pointer rounded-lg`}
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
              onClick={() => buttonAction()}
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
              Leave this 1:1 chat
            </div>
          ) : (
            activeChannel?.type !==
              'public' /* To simplify the logic of the demo, do not allow to leave from public channels */ && (
              <div
                className={`${roboto.className} flex flex-row justify-center my-6 items-center  font-medium text-sm px-4 mx-2.5 h-10 cursor-pointer rounded-lg`}
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
                  buttonAction()
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
                Leave conversation
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
