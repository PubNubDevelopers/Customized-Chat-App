import Image from 'next/image'
import Edit from './icons/edit'

export default function Avatar ({
  avatarUrl,
  present = -1,
  bubblePrecedent = '',
  width = 32,
  height = 32,
  editIcon = false,
  editActionHandler = () => {},
  border = false,
  appConfiguration,
  colorScheme = null
}) {
  return (
    <div className='relative'>
      <Image
        src={avatarUrl ? avatarUrl : '/avatars/placeholder.png'}
        alt='User avatar'
        className={`rounded-full ${border && 'border-2 border-white'}`}
        width={width}
        height={height}
      />
      {/* Presence Indicator */}
      {(appConfiguration == null || appConfiguration?.user_presence == true) &&
        present != -1 &&
        bubblePrecedent === '' &&
        (present > 0 ? (
          <div className='w-[12px] h-[12px] rounded-full border-1 border-white bg-success absolute left-[22px] top-[20px]'></div>
        ) : (
          <div className='w-[12px] h-[12px] rounded-full border-1 border-white bg-neutral300 absolute left-[22px] top-[20px]'></div>
        ))}
      {bubblePrecedent !== '' && (
        <div
          className='w-[22px] h-[20px] rounded-full text-xs absolute left-[18px] top-[16px] content-center text-center'
          style={{
            background: `${
              colorScheme &&
              (colorScheme['app_appearance'] === 'dark'
                ? colorScheme['accentDark']
                : colorScheme['accent'])
            }`,
            color: `${
              colorScheme &&
              (colorScheme['app_appearance'] === 'dark'
                ? colorScheme['secondaryDark']
                : colorScheme['secondary'])
            }`
          }}
        >
          {bubblePrecedent}
        </div>
      )}
      {editIcon && (
        <div
          className={`w-[35px] h-[35px] rounded-full text-xs m-2 cursor-pointer absolute -right-[15px] -bottom-[15px]`}
          style={{
            background: `${
              colorScheme &&
              (colorScheme['app_appearance'] === 'dark'
                ? colorScheme['accentDark']
                : colorScheme['accent'])
            }`
          }}
        >
          <div onClick={() => editActionHandler()}>
            <Edit
              className='rounded-full white p-1'
              width={40}
              height={40}
              fill={
                colorScheme &&
                (colorScheme['app_appearance'] === 'dark'
                  ? colorScheme['secondaryDark']
                  : colorScheme['secondary'])
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}
