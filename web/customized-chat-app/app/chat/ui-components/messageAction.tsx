import Image from 'next/image'
import ToolTip from './toolTip'

export default function MessageAction ({
  emojiPickerShown,
  messageActionClickHandler,
  toolTipText,
  toolTipVisible,
  setToolTipVisible,
  iconUrl,
  iconAlt
}) {
  return (
    <div
      className='hover:bg-navy100 hover:rounded-md relative p-1 pr-1 min-w-11'
      onClick={() => messageActionClickHandler()}
      onMouseEnter={() => setToolTipVisible(true)}
      onMouseLeave={() => setToolTipVisible(false)}
    >
      <Image
        src={iconUrl}
        alt={iconAlt}
        className='m-2'
        width={20}
        height={20}
        priority={true}
      />
      {!emojiPickerShown && (
        <ToolTip
          className={`${toolTipVisible ? 'block' : 'hidden'}`}
          tip={toolTipText}
        />
      )}
    </div>
  )
}
