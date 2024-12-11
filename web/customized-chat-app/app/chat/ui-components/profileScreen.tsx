import Image from 'next/image'
import Avatar from './avatar'
import { roboto } from '@/app/fonts'
import { ToastType } from '../../types'

export default function ProfileScreen ({
  profileScreenVisible,
  setProfileScreenVisible,
  name,
  profileUrl,
  logout,
  changeName,
  showUserMessage,
  changeUserNameScreenVisible
}) {

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
            alt='Close Rooms'
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
        }`}
      >
        <div
          className={`${roboto.className} text-sm font-medium flex flex-row text-white p-3 justify-between items-center`}
        >
          Settings
        </div>

        <div className='flex justify-center pb-6'>
          <Avatar
            avatarUrl={profileUrl}
            width={88}
            height={88}
            editIcon={true}
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
        <div className='flex flex-row justify-between items-center py-4 px-4'>
          <div className='flex flex-col'>
            <div className='text-lg text-white'>Name</div>
            <div className='text-lg text-white font-semibold'>{name}</div>
          </div>
          <div
            className={`${roboto.className} flex flex-row justify-between items-center font-medium text-sm px-6 mx-2.5 h-10 cursor-pointer rounded-lg bg-pubnubbabyblue`}
            onClick={() => changeName()}
          >
            Change
          </div>
        </div>



        <div className='border border-navy600'></div>

        <div
          className={`${roboto.className} flex flex-row justify-center items-center my-6 text-white font-medium text-sm px-4 mx-2.5 h-10 cursor-pointer border border-[#938F99] rounded-lg bg-sky-950`}
          onClick={() => logout()}
        >
          <Image
            src='/icons/chat-assets/logout.svg'
            alt='Logout'
            className='p-3'
            width={36}
            height={36}
            priority
          />
          Log out
        </div>
      </div>
    </div>
  )
}
