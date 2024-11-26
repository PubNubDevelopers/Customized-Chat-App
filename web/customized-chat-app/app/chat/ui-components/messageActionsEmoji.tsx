import { useState } from 'react'

export default function MessageActionsEmoji ({ received, onEmojiClick }) {
  return (
    <div
      className={`absolute flex flex-row p-2 gap-1 z-20 rounded-sm shadow-lg bg-white mr-24 select-none ${
        received ? 'right-[20px]' : 'left-[10px]'
      } ${received ? '-bottom-[0px]' : 'bottom-[20px]'} cursor-pointer`}
    >
      <div className='flex flex-row cursor-pointer gap-2'>
        <div
          className='hover:bg-navy100 rounded-lg p-1'
          onClick={() => onEmojiClick('😊')}
        >
          😊
        </div>
        <div
          className='hover:bg-navy100 rounded-lg p-1'
          onClick={() => onEmojiClick('🐶')}
        >
          🐶
        </div>
        <div
          className='hover:bg-navy100 rounded-lg p-1'
          onClick={() => onEmojiClick('🍊')}
        >
          🍊
        </div>
        <div
          className='hover:bg-navy100 rounded-lg p-1'
          onClick={() => onEmojiClick('🤓')}
        >
          🤓
        </div>
        <div
          className='hover:bg-navy100 rounded-lg p-1'
          onClick={() => onEmojiClick('🤕')}
        >
          🤕
        </div>
      </div>
    </div>
  )
}
