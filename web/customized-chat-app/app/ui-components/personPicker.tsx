import Avatar from '../chat/ui-components/avatar'
import { PresenceIcon } from '../types'

export default function PersonPicker ({
  id,
  name,
  avatarUrl,
  className = '',
  personSelected
}) {
  return (
    <div
      className={`bg-navy50 hover:bg-navy200 cursor-pointer ${className} p-2 border-2 w-56 border-navy300 rounded-xl flex flex-row items-center gap-3 select-none`}
      onClick={() => {
        personSelected(id)
      }}
    >
      {/* 
      Note: This demo will always hardcode the presence as online.  PubNub offers two ways to track whether a user is online or offline using our Chat SDK, either at the global level, or per-channel.  See https://www.pubnub.com/docs/chat/chat-sdk/build/features/users/presence for more information.
      */}
      <Avatar
        avatarUrl={avatarUrl}
        present={PresenceIcon.NOT_SHOWN}
        width={48}
        height={48}
        appConfiguration={null}
      ></Avatar>
      <div className='flex flex-col'>
        <div className='w-full text-md'>{name}</div>
      </div>
    </div>
  )
}
