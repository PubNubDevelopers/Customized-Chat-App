import Avatar from './avatar'
import { roboto } from '@/app/fonts'

export default function NewMessageUserRow ({
  user,
  present,
  clickAction,
  colorScheme
}) {
  return (
    <div
      className={`${roboto.className} flex flex-row text-base mx-4 my-2 gap-2 w-full items-center cursor-pointer`}
      onClick={() => clickAction(user)}
      style={{
        color: `${
          colorScheme?.app_appearance === 'dark'
            ? colorScheme?.secondaryDark
            : colorScheme?.secondary
        }`
      }}
    >
      <Avatar
        present={present}
        avatarUrl={
          user.profileUrl ? user.profileUrl : '/avatars/placeholder.png'
        }
        appConfiguration={null}
      />
      <div className=''>{user.name}</div>
    </div>
  )
}
