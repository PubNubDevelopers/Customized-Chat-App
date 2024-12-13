import Avatar from './avatar'
import { PresenceIcon } from '../../types'

export default function PersonPicker ({
  id,
  isThin = false,
  name,
  avatarUrl,
  className = '',
  personSelected
}) {
  return (
    <div
      className={`cursor-pointer flex flex-row items-center gap-3 select-none ${className} ${
        isThin
          ? 'h-12 px-3 text-white flex-row-reverse'
          : 'bg-navy50 hover:bg-navy200 p-2 w-56 border-2 border-navy300'
      } rounded-xl`}
      onClick={() => {
        personSelected(id)
      }}
    >
      <Avatar
        avatarUrl={avatarUrl}
        present={PresenceIcon.NOT_SHOWN}
        width={isThin ? 42 : 48}
        height={isThin ? 42 : 48}
        appConfiguration={null}
      ></Avatar>
      <div className='flex flex-col'>
        <div className='w-full text-md'>{name}</div>
      </div>
    </div>
  )
}
