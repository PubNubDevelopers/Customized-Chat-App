import Image from 'next/image'
import { roboto } from '@/app/fonts'
import PersonPicker from './personPicker'

export default function Header ({
  currentUser,
  userProfileClicked,
  setCreatingNewMessage,
  appConfiguration
}) {
  return (
    <div
      id='header'
      className='flex flex-row flex-nowrap justify-between h-16 bg-sky-950 select-none fixed w-full z-10'
    >
      <div className='flex items-center justify-center gap-2.5 ml-2.5 rounded-md m-1 px-2'>
        <div className='flex justify-center w-12 h-12 rounded-full bg-navy50'>
          <Image
            src='/pn-logo-red-tint.png'
            alt='PubNub Logo'
            className='flex self-center'
            width={23.81}
            height={17.07}
            priority
          />
        </div>
        <div className='text-neutral50 text-base'>PubNub</div>
      </div>
      <div className='flex items-center mr-2.5'>
        <div
          id='btn-message-new'
          className={`${
            roboto.className
          } flex flex-row min-w-52 items-center font-medium text-sm px-4 mx-2.5 h-10 rounded-lg ${'bg-pubnubbabyblue'} cursor-pointer ${
            (!appConfiguration?.group_chat ||
              appConfiguration?.group_chat == false) &&
            'hidden'
          }`}
          onClick={() => setCreatingNewMessage(true)}
        >
          <Image
            src='/icons/chat-assets/new_message.svg'
            alt='New Message icon'
            className='flex self-center mr-3'
            width={15}
            height={15}
            priority
          />
          New Message / Group
        </div>
        <div
          className='cursor-pointer hover:bg-sky-900 hover:rounded-md min-w-12'
          onClick={() => userProfileClicked()}
        >
          <PersonPicker
            id={currentUser?.id}
            isThin={true}
            name={currentUser?.name}
            avatarUrl={currentUser?.profileUrl}
            personSelected={() => {}}
          ></PersonPicker>
          {/*<Image
            src='/icons/chat-assets/person_outline.svg'
            alt='My Profile'
            className='flex self-center m-3'
            width={24}
            height={24}
            priority
          />*/}
        </div>
      </div>
    </div>
  )
}
