import { roboto } from '@/app/fonts'

export default function MentionSuggestions ({
  suggestedMentions,
  pickSuggestedMention,
}) {
  return (
    <div className='flex w-full px-7 flex-row bg-white'>
      {suggestedMentions.map((mention: SuggestedMention, index) => {
        return (
          <div
            key={index}
            className={`${roboto.className} flex text-sm m-1 rounded-lg border px-2 py-1 line-clamp-1 text-nowrap cursor-pointer border-neutral-300 bg-neutral-50 text-neutral-900`}
            onClick={() => {
              pickSuggestedMention(mention)
            }}
          >
            {mention.replaceWith}
          </div>
        )
      })}
    </div>
  )
}
