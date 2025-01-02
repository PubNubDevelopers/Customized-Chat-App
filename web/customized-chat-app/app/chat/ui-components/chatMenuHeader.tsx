import { ChatHeaderActionIcon } from '../../types'
import ExpandMore from './icons/expandMore'
import Add from './icons/add'

export default function ChatMenuHeader ({
  text,
  actionIcon,
  expanded,
  expandCollapse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  action = b => {},
  colorScheme
}) {
  return (
    <div className='mt-2'>
      <div className='flex flex-row items-center justify-between h-12 text-sm tracking-wide'>
        <div
          className='flex flex-row items-center select-none'
          style={{
            color: `${
              colorScheme?.app_appearance === 'dark'
                ? colorScheme?.secondaryDark
                : colorScheme?.secondary
            }`
          }}
        >
          <div
            className='flex w-12 h-12 items-center justify-center cursor-pointer'
            onClick={() => expandCollapse()}
          >
            <ExpandMore
              className={`${expanded ? '' : 'rotate-180'} w-3 h-[7px]`}
              width={12}
              height={7}
              fill={
                colorScheme?.app_appearance === 'dark'
                  ? colorScheme?.secondaryDark
                  : colorScheme?.secondary
              }
            />
          </div>
          {text}
        </div>
        <div className='flex h-12 items-center justify-center'>
          {actionIcon === ChatHeaderActionIcon.MARK_READ && (
            <div
              className='cursor-pointer mr-2 font-medium tracking-normal'
              style={{
                color: `${
                  colorScheme?.app_appearance === 'dark'
                    ? colorScheme?.secondaryDark
                    : colorScheme?.secondary
                }`
              }}
              onClick={e => action(e)}
            >
              Mark all as read
            </div>
          )}
          {actionIcon === ChatHeaderActionIcon.ADD && (
            <div className='cursor-pointer' onClick={() => action(true)}>
              <Add
                className={'m-3'}
                width={14}
                height={14}
                fill={
                  colorScheme?.app_appearance === 'dark'
                    ? colorScheme?.secondaryDark
                    : colorScheme?.secondary
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
