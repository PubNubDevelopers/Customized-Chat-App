import Avatar from './avatar'
import { PresenceIcon } from '@/app/types'

export default function ManagedMember ({
  user,
  name,
  lastElement = false,
  appConfiguration
}) {
  return (
    <div
      className={`flex justify-between items-center px-4 py-3 ${
        !lastElement && 'border-solid border-b border-navy200'
      }`}
    >
      <div className='flex flex-row items-center'>
        <Avatar
          present={user.active ? PresenceIcon.ONLINE : PresenceIcon.OFFLINE}
          avatarUrl={user.profileUrl}
          appConfiguration={appConfiguration}
        />
        <div className='flex pl-3 text-sm font-normal text-neutral-900'>
          {name}
        </div>
      </div>
    </div>
  )
}
