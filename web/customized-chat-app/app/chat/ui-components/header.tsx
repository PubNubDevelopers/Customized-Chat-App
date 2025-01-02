import Image from 'next/image'
import { roboto } from '@/app/fonts'
import PersonPicker from './personPicker'
import NewMessageIcon from './icons/newMessageIcon'
import { useEffect, useState } from 'react'

export default function Header ({
  currentUser,
  userProfileClicked,
  setCreatingNewMessage,
  shouldBlurScreen,
  appConfiguration,
  embeddedDemoConfig,
  colorScheme
}) {
  const [customerLogoUrl, setCustomerLogoUrl] = useState(
    '/pubnub-logos/pubnub.png'
  )

  useEffect(() => {
    function checkImage (url) {
      if (
        appConfiguration.customer_logo == null ||
        appConfiguration.customer_logo == ''
      ) {
        //  Empty string should default to PubNub logo
        setCustomerLogoUrl('/pubnub-logos/pubnub.png')
        return
      }
      const image = document.createElement('img')
      image.onload = function () {
        if (image.width > 0) {
          //  Image exists and is a valid image
          setCustomerLogoUrl(appConfiguration.customer_logo)
        }
      }
      image.onerror = function () {
        //  Image does not exist
        setCustomerLogoUrl('/pubnub-logos/pubnub.png')
      }
      image.src = url
    }

    if (appConfiguration != null) {
      checkImage(appConfiguration.customer_logo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfiguration?.customer_logo])

  return (
    <div
      id='header'
      className={`flex flex-row flex-nowrap justify-between h-16 select-none ${
        !embeddedDemoConfig && 'w-full fixed'
      } z-10 ${shouldBlurScreen && 'blur-sm opacity-40'}`}
      style={{
        background: `${
          colorScheme?.app_appearance === 'dark'
            ? colorScheme?.primaryDark
            : colorScheme?.primary
        }`
      }}
    >
      <div className='flex items-center justify-center gap-2.5 ml-2.5 rounded-md m-1 px-2'>
        <div className='mr-1'>
          {
            <Image
              src={customerLogoUrl}
              alt='Company Logo'
              width={0}
              height={0}
              sizes={'100vw'}
              className='h-10 w-auto'
              unoptimized={true}
              priority
            />
          }
        </div>

        <div
          className={`text-2xl`}
          style={{
            color: `${
              colorScheme?.app_appearance === 'dark'
                ? colorScheme?.secondaryDark
                : colorScheme?.secondary
            }`
          }}
        >
          {appConfiguration?.customer_name ?? ''}
        </div>
      </div>
      <div className='flex items-center mr-2.5'>
        <div
          id='btn-message-new'
          className={`${
            roboto.className
          } flex flex-row min-w-52 items-center font-medium text-sm px-4 mx-2.5 h-10 rounded-lg cursor-pointer ${
            (!appConfiguration?.group_chat ||
              appConfiguration?.group_chat == false) &&
            'hidden'
          }`}
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
          onClick={() => setCreatingNewMessage(true)}
        >
          {/*https://react-svgr.com/playground/*/}
          <NewMessageIcon
            className='flex self-center mr-3'
            width={15}
            height={15}
            fill={
              colorScheme?.app_appearance === 'dark'
                ? colorScheme?.secondaryDark
                : colorScheme?.secondary
            }
          />
          New Message / Group
        </div>
        <div
          className='cursor-pointer backdrop-blur-md rounded-md min-w-12'
          onClick={() => userProfileClicked()}
        >
          <PersonPicker
            id={currentUser?.id}
            isThin={true}
            name={currentUser?.name}
            avatarUrl={currentUser?.profileUrl}
            personSelected={() => {}}
            colorScheme={colorScheme}
          ></PersonPicker>
        </div>
      </div>
    </div>
  )
}
