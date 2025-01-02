export default function MessageReaction ({
  emoji,
  count,
  messageTimetoken,
  reactionClicked,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colorScheme
}) {
  return (
    emoji != '' &&
    count > 0 && (
      <div
        className='flex flex-row items-center rounded-lg border-1 border-[#E5E5E5] text-neutral900 gap-1 bg-[#FAFAFA] whitespace-nowrap mx-0.5 px-1 cursor-pointer select-none'
        onClick={() => reactionClicked(emoji, messageTimetoken)}
      >
        <div className='flex text-lg'>{emoji}</div>
        {count > 1 && (
          <div
            className='flex text-xs'
          >
            {count}
          </div>
        )}
      </div>
    )
  )
}
