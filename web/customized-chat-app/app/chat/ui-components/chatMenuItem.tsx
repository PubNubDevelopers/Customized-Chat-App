import Avatar from './avatar'
import UnreadIndicator from './unreadIndicator'
import { useState } from 'react'
import ToolTip from './toolTip'
import MarkAsRead from './icons/markAsRead'

export default function ChatMenuItem ({
  avatarUrl,
  text,
  present,
  avatarBubblePrecedent = '',
  count = '',
  markAsRead = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  markAsReadAction = e => {},
  setActiveChannel = () => {},
  appConfiguration,
  colorScheme
}) {
  const [showToolTip, setShowToolTip] = useState(false)

  const handleMouseEnter = () => {
    setShowToolTip(true)
  }
  const handleMouseLeave = () => {
    setShowToolTip(false)
  }

  return (
    <div
      className='flex flex-col cursor-pointer'
      onClick={() => {
        setActiveChannel()
      }}
    >
      <div className='flex flex-row justify-between items-center w-full pl-4'>
        <div
          className='flex flex-row py-2 gap-3 h-12 text-sm items-center'
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
            bubblePrecedent={avatarBubblePrecedent}
            avatarUrl={avatarUrl}
            appConfiguration={appConfiguration}
            colorScheme={colorScheme}
          />
          {text}
        </div>
        <div className='flex flex-row items-center'>
          <UnreadIndicator count={count} colorScheme={colorScheme} />
          {markAsRead && (
            <div
              className={`cursor-pointer w-4 h-4 m-3 fill-current ${
                showToolTip ? 'text-sky-700' : 'text-sky-900'
              }`}
              onClick={e => markAsReadAction(e)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className='relative'>
                <ToolTip
                  className={`${
                    showToolTip ? 'block' : 'hidden'
                  }  bottom-[0px]`}
                  tip='Read'
                  messageActionsTip={false}
                />
              </div>

              <MarkAsRead
                fill={
                  colorScheme?.app_appearance === 'dark'
                    ? colorScheme?.secondaryDark
                    : colorScheme?.secondary
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
