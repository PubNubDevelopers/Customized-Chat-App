/* eslint-disable @typescript-eslint/no-unused-vars */
import Avatar from './avatar'
import Image from 'next/image'
import { roboto } from '@/app/fonts'
import { useState, useEffect, useCallback } from 'react'
import MessageActions from './messageActions'
import PinnedMessagePill from './pinnedMessagePill'
import QuotedMessage from './quotedMessage'
import MessageReaction from './messageReaction'
import Sent from './icons/sent'
import Read from './icons/read'
import { MessageActionsTypes, PresenceIcon, ToastType } from '../../types'
import ToolTip from './toolTip'
import { Channel, TimetokenUtils, MixedTextTypedElement } from '@pubnub/chat'

export default function Message ({
  received,
  inThread = false,
  inPinned = false,
  avatarUrl,
  readReceipts,
  showReadIndicator = true,
  quotedMessageSender = '',
  sender,
  messageActionHandler = (a, b) => {},
  pinned = false,
  unpinMessageHandler = () => {},
  message,
  currentUserId,
  isOnline = -1,
  showUserMessage = (a, b, c, d) => {},
  showUserProfile = senderId => {},
  mutedOrBanned = false,
  activeChannelBackground,
  embeddedDemoConfig = null,
  forceShowActions = false,
  appConfiguration,
  colorScheme
}) {
  const [showToolTip, setShowToolTip] = useState(false)
  const [actionsShown, setActionsShown] = useState(forceShowActions)
  const [emojiPickerShown, setEmojiPickerShown] = useState(false)

  let messageHovered = false

  const handleMessageMouseEnter = e => {
    messageHovered = true
    setActionsShown(true)
  }
  const handleMessageMouseLeave = e => {
    messageHovered = false
    if (!forceShowActions) {
      setActionsShown(false)
    }
    setEmojiPickerShown(false)
  }

  function handleMessageActionsEnter () {
    setActionsShown(true)
  }

  function handleMessageActionsLeave () {
    if (!messageHovered && !forceShowActions) {
      setActionsShown(false)
    }
  }

  function copyMessageText (messageText) {
    navigator.clipboard.writeText(messageText)
  }

  function openLink (url) {
    window.open(url, '_blank')
  }

  function userClick (userId, userName) {
    showUserMessage(
      '@Mentioned User Clicked:',
      `You have Clicked on user with ID ${userId} and name ${userName}`,
      'https://www.pubnub.com/docs/chat/chat-sdk/build/features/users/mentions',
      ToastType.INFO
    )
  }

  function channelClick (channelId, channelName) {
    showUserMessage(
      '#Referenced Channel Clicked:',
      `You have Clicked on channel with ID ${channelId} and name ${channelName}`,
      'https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/references',
      ToastType.INFO
    )
  }

  async function reactionClicked (emoji) {
    if (embeddedDemoConfig != null) return
    await message?.toggleReaction(emoji)
  }

  const determineUserReadableDate = useCallback(timetoken => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const date = TimetokenUtils.timetokenToDate(timetoken)
    const datetime = `${days[date.getDay()]} ${date.getDate()} ${
      months[date.getMonth()]
    } ${(date.getHours() + '').padStart(2, '0')}:${(
      date.getMinutes() + ''
    ).padStart(2, '0')}`

    return datetime
  }, [])

  //  Originally I was not writing the 'lastTimetoken' for messages I was sending myself, however
  //  that caused the Chat SDK's notion of an unread message count inconsistent, so I am removing
  //  readReceipts I set myself in this useCallback
  const determineReadStatus = useCallback(
    (timetoken, readReceipts) => {
      if (!readReceipts) return false
      for (let i = 0; i < Object.keys(readReceipts).length; i++) {
        const receipt = Object.keys(readReceipts)[i]
        const findMe = readReceipts[receipt].indexOf(currentUserId)
        if (findMe > -1) {
          readReceipts[receipt].splice(findMe, 1)
        }
        if (readReceipts[receipt].length > 0 && receipt >= timetoken) {
          return true
        }
      }
      return false
    },
    [currentUserId]
  )

  //  const isMessageDeleted = useCallback(message => {
  //    return message.actions?.deleted?.deleted?.length > 0
  //  }, [])

  const renderMessagePart = useCallback(
    (messagePart: MixedTextTypedElement, index: number) => {
      if (messagePart?.type === 'text') {
        return (
          <span key={index} className='self-center'>
            {messagePart.content.text}
          </span>
        )
      }
      if (messagePart?.type === 'plainLink') {
        return (
          <span
            key={index}
            className='cursor-pointer underline'
            onClick={() => openLink(`${messagePart.content.link}`)}
          >
            {messagePart.content.link}
          </span>
        )
      }
      if (messagePart?.type === 'textLink') {
        return (
          <span
            key={index}
            className='cursor-pointer underline'
            onClick={() => openLink(`${messagePart.content.link}`)}
          >
            {messagePart.content.link}
          </span>
        )
      }
      if (messagePart?.type === 'mention') {
        return appConfiguration?.mention_user == true ? (
          <span
            key={index}
            onClick={() =>
              userClick(
                `${messagePart.content.id}`,
                `${messagePart.content.name}`
              )
            }
            className='rounded-lg border px-2 py-0.5 line-clamp-1 text-nowrap select-none cursor-pointer border-neutral-300 bg-neutral-50 text-neutral-900 m-1'
          >
            @{messagePart.content.name}
          </span>
        ) : (
          <span key={index} className='px-1'>
            {messagePart.content.name}
          </span>
        )
      }

      if (messagePart?.type === 'channelReference') {
        return appConfiguration?.channel_references == true ? (
          <span
            key={index}
            onClick={() =>
              channelClick(
                `${messagePart.content.id}`,
                `${messagePart.content.name}`
              )
            }
            className='rounded-lg border px-2 py-0.5 line-clamp-1 text-nowrap select-none cursor-pointer border-neutral-300 bg-neutral-50 text-neutral-900 m-1'
          >
            #{messagePart.content.name}
          </span>
        ) : (
          <span key={index} className='px-1'>
            {messagePart.content.name}
          </span>
        )
      }
      return 'error'
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appConfiguration?.mention_user, appConfiguration?.channel_references]
  )

  const renderFiles = useCallback(files => {
    return files.map((file, index) => (
      <div className='flex flex-col p-1' key={index}>
        {file.type?.indexOf('image') == 0 && (
          <div
            className='cursor-pointer select-none'
            onClick={() => {
              openLink(`${file.url}`)
            }}
          >
            <Image
              src={`${file.url}`}
              alt={`${file.name}`}
              width={0}
              height={0}
              sizes={'100vw'}
              className={'cursor-pointer w-[250px] h-auto'}
            />
            <div className='text-xs'>{file.name} (click to enlarge)</div>
          </div>
        )}
        {file.type?.indexOf('image') == -1 && (
          <div
            className='text-sm cursor-pointer'
            onClick={() => {
              openLink(`${file.url}`)
            }}
          >
            Attached file: {file.name}
          </div>
        )}
      </div>
    ))
  }, [])

  return (
    <div className='flex flex-col w-full'>
      <div
        className={`flex flex-row ${inThread ? '' : 'w-5/6'} my-4 ${
          inThread ? 'mx-6' : 'mx-8'
        } ${!received && !inThread && 'self-end'}`}
      >
        {received && !inThread && !inPinned && (
          <div
            className='min-w-11 cursor-pointer'
            onClick={() => {
              showUserProfile(message.userId)
            }}
          >
            {!inThread && (
              <Avatar
                present={isOnline}
                avatarUrl={avatarUrl ? avatarUrl : '/avatars/placeholder.png'}
                appConfiguration={appConfiguration}
                colorScheme={colorScheme}
              />
            )}
          </div>
        )}

        <div className='flex flex-col w-full gap-2'>
          <div
            className={`flex flex-row ${
              inThread || inPinned || received
                ? 'justify-between'
                : 'justify-end'
            }`}
          >
            {pinned && !received && (
              <div className='flex justify-start grow select-none'>
                <PinnedMessagePill colorScheme={colorScheme} />
              </div>
            )}
            {(inThread || inPinned || received) && (
              <div
                className={`${roboto.className} text-sm font-normal flex cursor-pointer select-none`}
                style={{
                  color: activeChannelBackground?.color ?? "#525252"
                }}  
                onClick={() => {
                  showUserProfile(message.userId)
                }}
              >
                {sender}
                {(inThread || inPinned) && !received && ' (you)'}
                {pinned && <PinnedMessagePill colorScheme={colorScheme} />}
              </div>
            )}
            <div
              className={`${roboto.className} text-sm font-normal flex`}
              style={{
                color: activeChannelBackground?.color ?? "#525252"
              }}
            >
              {determineUserReadableDate(message.timetoken)}
            </div>
          </div>

          <div
            className={`${
              roboto.className
            } relative text-base font-normal flex text-black ${
              received ? 'bg-neutral-50' : ''
            } p-4 rounded-b-lg ${
              received ? 'rounded-tr-lg' : 'rounded-tl-lg'
            } pb-[${!received ? '40px' : '0px'}]`}
            onMouseEnter={handleMessageMouseEnter}
            onMouseMove={handleMessageMouseEnter}
            onMouseLeave={handleMessageMouseLeave}
            style={{
              background: `${
                received
                  ? ''
                  : colorScheme?.app_appearance === 'dark'
                  ? colorScheme?.accentDark
                  : colorScheme?.accent
              }`,
              color: `${
                received
                  ? ''
                  : colorScheme?.app_appearance === 'dark'
                  ? colorScheme?.secondaryDark
                  : colorScheme?.secondary
              }`
            }}
          >
            {inPinned && (
              <div
                className='cursor-pointer'
                onClick={() => unpinMessageHandler()}
                onMouseEnter={() => {
                  setShowToolTip(true)
                }}
                onMouseLeave={() => {
                  setShowToolTip(false)
                }}
              >
                <div className='absolute right-[10px] top-[10px]'>
                  <div className='relative'>
                    <ToolTip
                      className={`${
                        showToolTip ? 'block' : 'hidden'
                      } bottom-[0px]`}
                      tip='Unpin'
                      messageActionsTip={false}
                    />
                  </div>
                  <Image
                    src='/icons/chat-assets/close.svg'
                    alt='Close'
                    className=''
                    width={20}
                    height={20}
                    priority
                  />
                </div>
              </div>
            )}
            <div className='flex flex-col w-full'>
              {message.quotedMessage && appConfiguration.message_quote && (
                <QuotedMessage
                  originalMessage={message}
                  originalMessageReceived={received}
                  quotedMessage={message.quotedMessage}
                  quotedMessageSender={quotedMessageSender}
                  setQuotedMessage={null}
                  displayedWithMesageInput={false}
                />
              )}
              {message.deleted && (
                <div className='flex flex-row items-center w-full flex-wrap'>
                  This message was deleted.
                  {message.userId == currentUserId && (
                    <div
                      className='cursor-pointer px-2 py-1 mx-2 rounded-xl'
                      onClick={async () => {
                        await message.restore()
                      }}
                      style={{
                        background: `${
                          colorScheme?.app_appearance === 'dark'
                            ? colorScheme?.primaryDark
                            : colorScheme?.primary
                        }`,
                        color: `${
                          colorScheme?.app_appearance === 'dark'
                            ? colorScheme?.secondaryDark
                            : colorScheme?.secondary
                        }`
                      }}
                
                    >
                      Restore Message
                    </div>
                  )}
                </div>
              )}
              {!message.deleted && (
                <div className='flex flex-col items-start w-full flex-wrap'>
                  <div className='flex flex-row flex-wrap'>
                    {message.actions && message.actions.edited && (
                      <span className='text-navy500 text-sm mr-1'>
                        (edited)
                      </span>
                    )}
                    {(message.content.text ||
                      message.content.plainLink ||
                      message.content.textLink ||
                      message.content.mention ||
                      message.content.channelReference) &&
                      message
                        ?.getMessageElements()
                        .map((msgPart, index) =>
                          renderMessagePart(msgPart, index)
                        )}
                    {/* If the message was blank and subsequently edited */}
                    {!message.content.text && message.text && message.text}
                  </div>
                  {message.meta && message.meta.originalChannelId && (
                    <span className='text-xs absolute top-0 mt-0.5'>
                      Forwarded Message
                    </span>
                  )}
                  {message.files &&
                    message.files.length > 0 &&
                    appConfiguration?.message_send_file == true &&
                    renderFiles(message.files)}
                </div>
              )}
            </div>
            {!received &&
              showReadIndicator &&
              appConfiguration?.message_read_receipts == true &&
              (determineReadStatus(message.timetoken, readReceipts) ? (
                <Read
                  className='absolute right-[10px] bottom-[14px]'
                  width={23}
                  height={12}
                  stroke={
                    colorScheme?.app_appearance === 'dark'
                      ? colorScheme?.secondaryDark
                      : colorScheme?.secondary
                  }
                />
              ) : (
                <Sent
                  className='absolute right-[10px] bottom-[14px]'
                  width={21}
                  height={12}
                  stroke={
                    colorScheme?.app_appearance === 'dark'
                      ? colorScheme?.secondaryDark
                      : colorScheme?.secondary
                  }
                />
              ))}

            <div className='absolute right-[10px] -bottom-[20px] flex flex-row items-center z-10 select-none'>
              {/*arrayOfEmojiReactions*/}

              {appConfiguration?.message_reactions && message.reactions
                ? Object?.keys(message.reactions)
                    .slice(0, 18)
                    .map((emoji, index) => (
                      <MessageReaction
                        emoji={emoji}
                        messageTimetoken={message.timetoken}
                        count={message.reactions[emoji].length}
                        reactionClicked={reactionClicked}
                        colorScheme={colorScheme}
                        key={index}
                      />
                    ))
                : ''}
            </div>
            {!inThread &&
              message.hasThread &&
              appConfiguration?.message_threads && (
                <div
                  className='absolute right-[10px] -bottom-[28px] flex flex-row items-center z-0 cursor-pointer select-none'
                  onClick={() => {
                    messageActionHandler(
                      MessageActionsTypes.REPLY_IN_THREAD,
                      message
                    )
                  }}
                >
                  {/*Whether or not there is a threaded reply*/}
                  <div className='flex flex-row cursor-pointer'>
                    <Image
                      src='/icons/chat-assets/reveal-thread.svg'
                      alt='Expand'
                      className=''
                      width={20}
                      height={20}
                      priority
                    />
                    <div className='text-sm font-normal text-navy700'>
                      Replies
                    </div>
                  </div>
                </div>
              )}
            {/* actions go here for received */}
            {received &&
              !inThread &&
              !inPinned &&
              !message.deleted &&
              !mutedOrBanned && (
                <MessageActions
                  received={received}
                  actionsShown={actionsShown}
                  emojiPickerShown={emojiPickerShown}
                  setEmojiPickerShown={setEmojiPickerShown}
                  isPinned={pinned}
                  messageActionsEnter={() => handleMessageActionsEnter()}
                  messageActionsLeave={() => handleMessageActionsLeave()}
                  emojiClick={
                    appConfiguration?.message_reactions == true
                      ? emoji => {
                          reactionClicked(emoji)
                        }
                      : null
                  }
                  replyInThreadClick={
                    appConfiguration?.message_threads == true
                      ? () => {
                          messageActionHandler(
                            MessageActionsTypes.REPLY_IN_THREAD,
                            message
                          )
                        }
                      : null
                  }
                  quoteMessageClick={
                    appConfiguration?.message_quote == true
                      ? () => {
                          messageActionHandler(
                            MessageActionsTypes.QUOTE,
                            message
                          )
                        }
                      : null
                  }
                  pinMessageClick={
                    appConfiguration?.message_pin == true
                      ? () => {
                          messageActionHandler(MessageActionsTypes.PIN, message)
                        }
                      : null
                  }
                  forwardMessageClick={
                    appConfiguration?.message_forward == true
                      ? () => {
                          messageActionHandler(
                            MessageActionsTypes.FORWARD,
                            message
                          )
                        }
                      : null
                  }
                  editMessageClick={
                    appConfiguration?.message_editing == true
                      ? () => {
                          messageActionHandler(
                            MessageActionsTypes.EDIT,
                            message
                          )
                        }
                      : null
                  }
                  deleteMessageClick={
                    appConfiguration?.message_deletion_soft == true &&
                    message.senderId == currentUserId
                      ? () => {
                          messageActionHandler(
                            MessageActionsTypes.DELETE,
                            message
                          )
                        }
                      : null
                  }
                  reportMessageClick={
                    appConfiguration?.message_report == true
                      ? () => {
                          messageActionHandler(
                            MessageActionsTypes.REPORT,
                            message
                          )
                        }
                      : null
                  }
                />
              )}
          </div>
          {/* actions go here for sent */}
          {!received &&
            !inThread &&
            !inPinned &&
            !message.deleted &&
            !mutedOrBanned && (
              <MessageActions
                received={received}
                actionsShown={actionsShown}
                emojiPickerShown={emojiPickerShown}
                setEmojiPickerShown={setEmojiPickerShown}
                isPinned={pinned}
                messageActionsEnter={() => handleMessageActionsEnter()}
                messageActionsLeave={() => handleMessageActionsLeave()}
                emojiClick={
                  appConfiguration?.message_reactions == true
                    ? emoji => {
                        reactionClicked(emoji)
                      }
                    : null
                }
                replyInThreadClick={
                  appConfiguration?.message_threads == true
                    ? () => {
                        messageActionHandler(
                          MessageActionsTypes.REPLY_IN_THREAD,
                          message
                        )
                      }
                    : null
                }
                quoteMessageClick={
                  appConfiguration?.message_quote == true
                    ? () => {
                        messageActionHandler(MessageActionsTypes.QUOTE, message)
                      }
                    : null
                }
                pinMessageClick={
                  appConfiguration?.message_pin == true
                    ? () => {
                        messageActionHandler(MessageActionsTypes.PIN, message)
                      }
                    : null
                }
                forwardMessageClick={
                  appConfiguration?.message_forward == true
                    ? () => {
                        messageActionHandler(
                          MessageActionsTypes.FORWARD,
                          message
                        )
                      }
                    : null
                }
                editMessageClick={
                  appConfiguration?.message_editing == true
                    ? () => {
                        messageActionHandler(MessageActionsTypes.EDIT, message)
                      }
                    : null
                }
                deleteMessageClick={
                  appConfiguration?.message_deletion_soft == true
                    ? () => {
                        messageActionHandler(
                          MessageActionsTypes.DELETE,
                          message
                        )
                      }
                    : null
                }
                reportMessageClick={
                  appConfiguration?.message_report == true
                    ? () => {
                        messageActionHandler(
                          MessageActionsTypes.REPORT,
                          message
                        )
                      }
                    : null
                }
              />
            )}
        </div>
      </div>
      {inPinned && (
        <div className='flex flex-row place-self-center mt-2 border border-navy200 w-5/6'></div>
      )}
    </div>
  )
}
