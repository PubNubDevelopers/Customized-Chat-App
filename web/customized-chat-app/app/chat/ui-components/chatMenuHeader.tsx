import Image from 'next/image'
import { ChatHeaderActionIcon } from '../../types'

export default function ChatMenuHeader ({
  text,
  actionIcon,
  expanded,
  expandCollapse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  action = b => {}
}) {
  return (
    <div className='mt-2'>
      <div className='flex flex-row items-center justify-between h-12 text-sm tracking-wide'>
        <div className='flex flex-row items-center  select-none'>
          <div
            className='flex w-12 h-12 items-center justify-center cursor-pointer'
            onClick={() => expandCollapse()}
          >
            <Image
              src='/icons/chat-assets/expand-more.svg'
              alt='Expand'
              className={`${expanded ? '' : 'rotate-180'} w-3 h-[7px]`}
              width={12}
              height={7}
              priority
            />
          </div>
          {text}
        </div>
        <div className='flex h-12 items-center justify-center'>
          {actionIcon === ChatHeaderActionIcon.MARK_READ && (
            <div
              className='cursor-pointer mr-2 text-sky-700 hover:text-sky-900 font-medium tracking-normal'
              onClick={e => action(e)}
            >
              Mark all as read
            </div>
          )}
          {actionIcon === ChatHeaderActionIcon.ADD && (
            <div className='cursor-pointer' onClick={() => action(true)}>
              <Image
                src='/icons/chat-assets/add.svg'
                alt='Add'
                className='m-3'
                width={14}
                height={14}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
