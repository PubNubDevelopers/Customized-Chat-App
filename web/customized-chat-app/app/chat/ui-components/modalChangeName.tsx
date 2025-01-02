import { useState, useEffect } from 'react'
import { roboto } from '@/app/fonts'
import { ChatNameModals } from '../../types'
import Close from './icons/close'

export default function ModalChangeName ({
  name,
  activeChannel,
  modalType,
  saveAction,
  changeNameModalVisible,
  setChangeNameModalVisible,
  colorScheme
}) {
  const [newChatName, setNewChatName] = useState('')

  useEffect(() => {
    if (!activeChannel || modalType == ChatNameModals.USER) return
    setNewChatName(activeChannel.name)
  }, [activeChannel, modalType])

  useEffect(() => {
    if (!name || modalType == ChatNameModals.CHANNEL) return
    setNewChatName(name)
  }, [modalType, name])

  return (
    <div
      className={`${
        !changeNameModalVisible && 'hidden'
      } fixed mx-auto inset-0 flex justify-center items-center z-40 select-none`}
    >
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
              setChangeNameModalVisible(false)
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
        <div className='flex flex-col px-12 pb-12 gap-5'>
          <div className='flex font-semibold text-lg justify-center mb-2'>
            {modalType == ChatNameModals.USER
              ? 'Change your name'
              : 'Change chat name'}
          </div>
          <div className='flex font-normal text-base justify-center'>
            {modalType == ChatNameModals.USER
              ? 'The Chat SDK uses Metadata to store context about your user, such as their name or alias'
              : 'The Chat SDK uses Metadata to store context about your chat, such as a human readable name'}
          </div>

          <div className='flex flex-col gap-1 my-4'>
            <div className='flex font-normal text-sm'>Name</div>
            <div className='flex'>
              {' '}
              <input
                className='flex w-full rounded-md bg-neutral50 text-neutral900 border h-12 px-6 border-neutral-300 shadow-sm text-sm focus:ring-1 focus:ring-black outline-none'
                placeholder='New chat name'
                value={newChatName}
                onChange={e => {
                  setNewChatName(e.target.value)
                }}
              />
            </div>
          </div>
          <div className='flex flex-row justify-between'>
            <div
              className={`${roboto.className} flex flex-row justify-center items-center font-normal text-base w-1/3 h-12 cursor-pointer border rounded-lg`}
              onClick={() => {
                setChangeNameModalVisible(false)
              }}
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
              Cancel
            </div>
            <div
              className={`${roboto.className} flex flex-row justify-center items-center text-neutral-50 font-normal text-base w-1/3 h-12 cursor-pointer shadow-sm rounded-lg bg-navy900`}
              onClick={() => {
                if (newChatName && newChatName.length > 0) {
                  saveAction(newChatName)
                  setChangeNameModalVisible(false)
                }
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
              Save
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
