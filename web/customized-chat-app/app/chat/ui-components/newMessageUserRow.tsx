import Avatar from './avatar'
import { roboto } from '@/app/fonts'

export default function NewMessageUserRow ({ user, present, clickAction }) {
  return (
    <div
      className={`${roboto.className} flex flex-row text-base mx-4 my-2 gap-2 w-full items-center text-neutral-900 cursor-pointer`}
      onClick={() => clickAction(user)}
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
