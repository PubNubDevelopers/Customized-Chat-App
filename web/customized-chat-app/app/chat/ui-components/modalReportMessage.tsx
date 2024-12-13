import Image from 'next/image'
import { useState, useRef } from 'react'
import { roboto } from '@/app/fonts'

export default function ModalReportMessage ({
  message,
  reportAction,
  reportMessageModalVisible,
  setReportMessageModalVisible
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
      <div className='flex flex-col lg:w-1/2 md:w-2/3 sm:w-2/3 shadow-xl rounded-xl bg-white border border-neutral-300'>
        <div className='flex flex-row justify-end'>
          <div
            className=' cursor-pointer'
            onClick={() => {
              setReportMessageModalVisible(false)
            }}
          >
            <Image
              src='/icons/chat-assets/close.svg'
              alt='Close'
              className='m-3'
              width={24}
              height={24}
              priority
            />
          </div>
        </div>
        <div className='flex flex-col px-12 pb-12 gap-5'>
          <div className='flex font-semibold text-lg justify-center text-neutral-900 mb-2'>
            You are reporting the following message:
          </div>
          <div className='flex font-normal text-base justify-center text-neutral-600'>
            {message?.text}
          </div>

          <div className='flex flex-col gap-1 my-4'>
            <div className='flex font-normal text-sm text-neutral-900'>
              Why are you reporting this message?
            </div>
            <div className='flex'>
              {' '}
              <input
                className='flex w-full rounded-md bg-white border h-12 px-6 border-neutral-300 shadow-sm text-sm focus:ring-1 focus:ring-inputring outline-none placeholder:text-neutral-600'
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
              className={`${roboto.className} flex flex-row justify-center items-center text-navy700 font-normal text-base w-1/3 h-12 cursor-pointer border border-neutral-300 rounded-lg bg-white`}
              onClick={() => {
                setReportMessageModalVisible(false)
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
            >
              Report
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
