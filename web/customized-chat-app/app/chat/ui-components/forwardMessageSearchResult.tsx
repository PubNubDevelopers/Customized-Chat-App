import Avatar from './avatar'
import { roboto } from '@/app/fonts'
import { PresenceIcon } from '../../types'

export default function ForwardMessageSearchResult ({
  text,
  avatarUrl,
  clickAction,
  colorScheme
}) {
  return (
    <div
      className={`${roboto.className} flex flex-row text-base mx-4 my-2 gap-2 w-full items-center cursor-pointer`
      }
      onClick={() => clickAction()}
      style={{
        color: `${
          colorScheme?.app_appearance === 'dark'
            ? colorScheme?.secondaryDark
            : colorScheme?.secondary
        }`
      }}
    >
      <Avatar
        present={PresenceIcon.NOT_SHOWN}
        avatarUrl={avatarUrl}
        appConfiguration={null}
      />

      <div className=''>{text}</div>
    </div>
  )
}
