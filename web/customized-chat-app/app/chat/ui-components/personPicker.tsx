import Avatar from './avatar'
import { PresenceIcon } from '../../types'

export default function PersonPicker ({
  id,
  isThin = false,
  name,
  avatarUrl,
  className = '',
  personSelected,
  colorScheme = null
}) {
  return (
    <div
      className={`cursor-pointer flex flex-row items-center gap-3 select-none ${className} ${
        isThin
          ? 'h-12 px-3 flex-row-reverse'
          : 'hover:ring p-2 w-56 border-2'
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
        <div
          className='w-full text-md'
          style={{
            color: `${
              colorScheme && (colorScheme['app_appearance'] === 'dark'
                ? colorScheme['secondaryDark']
                : colorScheme['secondary'])
            }`
          }}
        >
          {name}
        </div>
      </div>
    </div>
  )
}
