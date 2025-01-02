import { roboto } from '@/app/fonts'
import ManagedMember from './managedMember'
import Close from './icons/close'

export default function ModalManageMembers ({
  activeChannelUsers,
  saveAction,
  manageMembersModalVisible,
  setManageMembersModalVisible,
  appConfiguration,
  colorScheme
}) {
  return (
    <div
      className={`${
        !manageMembersModalVisible && 'hidden'
      } fixed mx-auto inset-0 flex justify-center items-center z-40 select-none`}
    >
      {/* Example Modal */}
      <div
        className='flex flex-col lg:w-1/2 md:w-2/3 sm:w-2/3 shadow-xl rounded-xl border border-neutral-300'
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
        <div className='flex flex-row justify-end'>
          <div
            className=' cursor-pointer'
            onClick={() => {
              setManageMembersModalVisible(false)
            }}
          >
            <Close
              className='m-3'
              width={24}
              height={24}
              fill={
                colorScheme?.app_appearance === 'dark'
                  ? colorScheme?.secondaryDark
                  : colorScheme?.secondary
              }
            />
          </div>
        </div>
        <div className='flex flex-col px-12 pb-12 gap-3'>
          <div className='flex font-semibold text-lg justify-center mb-2'>
            View Members ({activeChannelUsers?.length})
          </div>
          <div className='flex font-normal text-base justify-center'>
            A membership associates a user with a specific channel and is
            created / destroyed when a user joins or leaves a channel
            respectively.
          </div>

          <div className='flex flex-col my-2 max-h-[40vh] overflow-y-auto overscroll-none'>
            {activeChannelUsers?.map((user, index) => {
              return (
                <ManagedMember
                  key={index}
                  user={user}
                  name={`${user.name}`}
                  lastElement={index == activeChannelUsers?.length - 1}
                  appConfiguration={appConfiguration}
                  colorScheme={colorScheme}
                />
              )
            })}
          </div>
          <div className='flex flex-row justify-end'>
            <div
              className={`${roboto.className} flex flex-row justify-center items-center font-normal text-base w-1/3 h-12 cursor-pointer shadow-sm rounded-lg`}
              onClick={() => saveAction()}
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
              OK
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
