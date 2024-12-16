import Avatar from './avatar'
import { roboto } from '@/app/fonts'
import { PresenceIcon } from '../../types'

export default function ForwardMessageSearchResult ({
  text,
  avatarUrl,
  clickAction
}) {
  return (
    <div
      className={`${roboto.className} flex flex-row text-base mx-4 my-2 gap-2 w-full items-center text-neutral-900 cursor-pointer`}
      onClick={() => clickAction()}
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
