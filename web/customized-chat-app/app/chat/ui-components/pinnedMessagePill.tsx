import { roboto } from '@/app/fonts'
import Pin from './icons/pin'

export default function PinnedMessagePill ({ colorScheme }) {
  return (
    <div
      className={`${roboto.className} flex flex-row items-center justify-between rounded ml-4 px-2 gap-0.5 border`}
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
      <div className='text-xs font-normal'>Pinned message</div>
      <Pin
        className='ml-1'
        width={12}
        height={12}
        fill={
          colorScheme?.app_appearance === 'dark'
            ? colorScheme?.secondaryDark
            : colorScheme?.secondary
        }
      />
    </div>
  )
}
