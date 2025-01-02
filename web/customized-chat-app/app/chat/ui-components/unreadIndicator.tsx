export default function UnreadIndicator ({ count, colorScheme }) {
  return (
    count != null &&
    count != '' && (
      <div
        className='flex rounded-[10px] px-2 py-0.5 font-medium text-xs '
        style={{
          background: `${
            colorScheme?.app_appearance === 'dark'
              ? colorScheme?.accentDark
              : colorScheme?.accent
          }`,
          color: `${
            colorScheme?.app_appearance === 'dark'
              ? colorScheme?.secondaryDark
              : colorScheme?.secondary
          }`
        }}
      >
        {count}
      </div>
    )
  )
}
