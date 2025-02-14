import Image from 'next/image'
import { roboto } from '@/app/fonts'
import PersonPicker from './personPicker'
import NewMessageIcon from './icons/newMessageIcon'
import { useEffect, useState } from 'react'
//  Only used when embedded within the Chat Builder dashboard
import { Tooltip } from '@nextui-org/react'

export default function Header ({
  currentUser,
  userProfileClicked,
  setCreatingNewMessage,
  shouldBlurScreen,
  appConfiguration,
  embeddedDemoConfig,
  colorScheme
}) {
  const AlertIcon = props => {
    return (
      <svg
        aria-hidden='true'
        focusable='false'
        height='20'
        role='presentation'
        viewBox='0 0 16 20'
        width='16'
        {...props}
      >
        <path
          d='M7.33325 6.66732H8.66659V8.00066H7.33325V6.66732ZM7.33325 9.33399H8.66659V13.334H7.33325V9.33399ZM7.99992 3.33398C4.31992 3.33398 1.33325 6.32066 1.33325 10.0007C1.33325 13.6807 4.31992 16.6673 7.99992 16.6673C11.6799 16.6673 14.6666 13.6807 14.6666 10.0007C14.6666 6.32066 11.6799 3.33398 7.99992 3.33398ZM7.99992 15.334C5.05992 15.334 2.66659 12.9407 2.66659 10.0007C2.66659 7.06066 5.05992 4.66732 7.99992 4.66732C10.9399 4.66732 13.3333 7.06066 13.3333 10.0007C13.3333 12.9407 10.9399 15.334 7.99992 15.334Z'
          fill='currentColor'
        />
      </svg>
    )
  }

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
      {embeddedDemoConfig && (
        <Tooltip
          content={
            <div className='flex flex-col'>
              <div className=''>Preview has limited functionality.</div>
              <div className=''>
                Run the app (test your configuration) to fully experience
                selected chat features
              </div>
            </div>
          }
          showArrow={false}
          placement={'right'}
          offset={-10}
          classNames={{
            content: [
              'bg-brandAccentNavy1-16pc text-neutral-50 text-sm max-w-64'
            ]
          }}
        >
          <div className='flex flex-row gap-1 items-center text-neutral-50 text-lg font-medium'>
            <div style={{ color: `${colorScheme?.secondary}` }}>PREVIEW</div>{' '}
            <div style={{ color: `${colorScheme?.accent}` }}>
              <AlertIcon />
            </div>
          </div>
        </Tooltip>
      )}
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
