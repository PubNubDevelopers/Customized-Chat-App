import { useState, useRef } from 'react'
import { roboto } from '@/app/fonts'
import Close from './icons/close'

export default function ModalReportMessage ({
  message,
  reportAction,
  reportMessageModalVisible,
  setReportMessageModalVisible,
  colorScheme
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [reportReason, setReportReason] = useState('')

  return (
    <div
      className={`${
        !reportMessageModalVisible && 'hidden'
      } fixed mx-auto inset-0 flex justify-center items-center z-40 select-none`}
    >
      {/* Example Modal */}
      <div className='flex flex-col lg:w-1/2 md:w-2/3 sm:w-2/3 shadow-xl rounded-xl border border-neutral-300'
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
      }}>
        <div className='flex flex-row justify-end'>
          <div
            className=' cursor-pointer'
            onClick={() => {
              setReportMessageModalVisible(false)
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
            You are reporting the following message:
          </div>
          <div className='flex font-normal text-base justify-center'>
            {/* Usually you would use message.text but I'm using content here for the embedded demo test data */}
            {message?.text ? message.text : message?.content?.text}
          </div>

          <div className='flex flex-col gap-1 my-4'>
            <div className='flex font-normal text-sm'>
              Why are you reporting this message?
            </div>
            <div className='flex'>
              {' '}
              <input
                className='flex w-full rounded-md bg-neutral50 text-neutral900 border h-12 px-6 border-neutral-300 shadow-sm text-sm focus:ring-1 focus:ring-black outline-none'
                placeholder='Please specify a reason'
                value={reportReason}
                ref={inputRef}
                onChange={e => {
                  setReportReason(e.target.value)
                }}
              />
            </div>
          </div>
          <div className='flex flex-row justify-between'>
            <div
              className={`${roboto.className} flex flex-row justify-center items-center text-navy700 font-normal text-base w-1/3 h-12 cursor-pointer border rounded-lg bg-white`}
              onClick={() => {
                setReportMessageModalVisible(false)
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
                if (reportReason && reportReason.length > 0) {
                  reportAction(reportReason)
                  setReportMessageModalVisible(false)
                  setReportReason('')
                } else {
                  inputRef.current?.focus()
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
              Report
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
