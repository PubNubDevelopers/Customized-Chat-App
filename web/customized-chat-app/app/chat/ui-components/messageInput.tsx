import Image from 'next/image'
import UnreadIndicator from './unreadIndicator'
import { MessageDraft, User, Channel } from '@pubnub/chat'
import QuotedMessage from './quotedMessage'
import MentionSuggestions from './mentionSuggestions'
import { useState, useEffect, useRef } from 'react'
import { ToastType } from '../../types'

export default function MessageInput ({
  activeChannel,
  replyInThread,
  quotedMessage,
  quotedMessageSender,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setQuotedMessage = any => {},
  //creatingNewMessage = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showUserMessage = (a, b, c, d) => {},
  //plusAction = () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setShowEmojiPicker = any => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setEmojiPickerTargetsInput = any => {},
  selectedEmoji = '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSelectedEmoji = a => {},
  currentlyEditingMessage,
  setCurrentlyEditingMessage,
  activeChannelRestrictions,
  embeddedDemoConfig = null,
  appConfiguration
}) {
  const [text, setText] = useState('')
  const [newMessageDraft, setNewMessageDraft] = useState<MessageDraft | null>()
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([])
  const [nameOccurrenceIndex, setNameOccurrenceIndex] = useState<number>(-1)
  const [suggestedChannels, setSuggestedChannels] = useState<Channel[]>([])
  const [channelOccurrenceIndex, setChannelOccurrenceIndex] =
    useState<number>(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const [attachmentsCount, setAttachmentsCount] = useState(0)
  const [showUploadSpinner, setShowUploadSpinner] = useState(false)

  async function handleSend (event: React.SyntheticEvent) {
    event.preventDefault()
    if ((!text && attachmentsCount == 0) || !activeChannel) return
    if (currentlyEditingMessage) {
      if (currentlyEditingMessage.text == text) {
        //  The text has not changed
        console.log('text unchanged')
        return
      }
      if (!embeddedDemoConfig) {
        console.log('calling edit text')
        await currentlyEditingMessage?.editText(text)
      }
      setCurrentlyEditingMessage(null)
      setText('')
      return
    }

    if (!newMessageDraft) return
    if (replyInThread) {
      //  This demo only supports text replies in the thread UI
      await activeChannel.sendText(text, { storeInHistory: true })
      setText('')
    } else {
      if (quotedMessage) {
        newMessageDraft.addQuote(quotedMessage)
      }
      setShowUploadSpinner(true)
      try {
        await newMessageDraft.send({ storeInHistory: true })
      } catch {
        showUserMessage(
          'Upload Error:',
          'Your attachment(s) failed to upload, possibly because you did not enable "File Sharing" on your keyset, or the attachments exceeded the file size limit (5MB by default)',
          'https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/files',
          ToastType.ERROR
        )
      }
      setShowUploadSpinner(false)
      setNewMessageDraft(
        activeChannel?.createMessageDraft({
          userSuggestionSource: 'channel',
          isTypingIndicatorTriggered: activeChannel.type !== 'public',
          userLimit: 6,
          channelLimit: 6
        })
      )
      setAttachmentsCount(0)
      setQuotedMessage(false)
      setText('')
    }
  }

  async function handleTyping (e) {
    if (embeddedDemoConfig != null) return
    if (!activeChannel) return
    setText(e.target.value)
    if (currentlyEditingMessage) return

    if (activeChannel.type !== 'public') {
      activeChannel.startTyping()
    }

    const response = await newMessageDraft?.onChange(e.target.value)
    if ((response?.users.suggestedUsers.length ?? 0) > 0) {
      if (appConfiguration?.mention_user) {
        setSuggestedUsers(response!.users.suggestedUsers)
        setNameOccurrenceIndex(response!.users.nameOccurrenceIndex)
      }
    } else {
      setSuggestedUsers([])
      setNameOccurrenceIndex(-1)
    }
    if ((response?.channels.suggestedChannels.length ?? 0) > 0) {
      if (appConfiguration?.channel_references) {
        setSuggestedChannels(response!.channels.suggestedChannels)
        setChannelOccurrenceIndex(response!.channels.channelOccurrenceIndex)
      }
    } else {
      setSuggestedChannels([])
      setChannelOccurrenceIndex(-1)
    }
  }

  async function addAttachment () {
    if (embeddedDemoConfig != null) return
    if (!newMessageDraft) return
    if (attachmentsCount > 0) {
      newMessageDraft.files = undefined
      setAttachmentsCount(0)
    } else {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = true
      input.onchange = () => {
        if (input.files) {
          const files = Array.from(input.files)
          newMessageDraft.files = files
          setAttachmentsCount(files.length)
          inputRef.current?.focus()
        }
      }
      input.click()
    }
  }

  async function addEmoji () {
    if (embeddedDemoConfig != null) return
    setEmojiPickerTargetsInput(true)
    setShowEmojiPicker(true)
  }

  function pickSuggestedUser (user: User) {
    if (!newMessageDraft) return
    newMessageDraft.addMentionedUser(user, nameOccurrenceIndex)
    setText(newMessageDraft.value)
    setSuggestedUsers([])
    setNameOccurrenceIndex(-1)
    inputRef.current?.focus()
  }

  function pickSuggestedChannel (channel: Channel) {
    if (!newMessageDraft) return
    newMessageDraft.addReferencedChannel(channel, channelOccurrenceIndex)
    setText(newMessageDraft.value)
    setSuggestedChannels([])
    setChannelOccurrenceIndex(-1)
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (!activeChannel) return
    if (currentlyEditingMessage != null) {
      {
        /* Usually you would use message.text but I'm using content here for the embedded demo test data */
      }
      setText(
        currentlyEditingMessage?.text
          ? currentlyEditingMessage.text
          : currentlyEditingMessage?.content?.text
      )
      setAttachmentsCount(0)
      setQuotedMessage(false)
      setNewMessageDraft(null)
      return
    }
    if (embeddedDemoConfig != null) return
    setNewMessageDraft(
      activeChannel.createMessageDraft({
        userSuggestionSource: 'channel',
        isTypingIndicatorTriggered: activeChannel.type !== 'public',
        userLimit: 6,
        channelLimit: 6
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChannel, currentlyEditingMessage, embeddedDemoConfig])

  useEffect(() => {
    if (!selectedEmoji) return
    if (selectedEmoji === '') return
    setText(text + selectedEmoji)
    newMessageDraft?.onChange(text + selectedEmoji)
    setSelectedEmoji('')
    inputRef.current?.focus()
  }, [newMessageDraft, selectedEmoji, setSelectedEmoji, text])

  return (
    <div
      className={`flex flex-col w-full items-center border-y border-r border-navy200 select-none ${
        quotedMessage ? 'h-[170px]' : ''
      } pr-6`}
    >
      {currentlyEditingMessage && !(activeChannelRestrictions?.mute || activeChannelRestrictions?.ban) &&(
        <div className='text-cherryDark w-full ml-12 pt-2'>Editing Message</div>
      )}
      {showUploadSpinner && attachmentsCount > 0 && (
        <div className='text-cherryDark w-full ml-12 pt-2'>
          Uploading Attachments...
        </div>
      )}
      {((suggestedUsers && suggestedUsers.length > 0) ||
        (suggestedChannels && suggestedChannels.length > 0)) && (
        <MentionSuggestions
          suggestedUsers={suggestedUsers}
          suggestedChannels={suggestedChannels}
          pickSuggestedUser={user => {
            pickSuggestedUser(user)
          }}
          pickSuggestedChannel={channel => {
            pickSuggestedChannel(channel)
          }}
        />
      )}
      {/* The sections around here hard-code the height of the message input Div, which will vary depending on whether there is a quoted message displayed or not.  Without a quoted message it is 114px, but with a quoted message it is 170px */}
      {quotedMessage && (
        <div className={`flex flex-row w-full h-[100px]`}>
          <QuotedMessage
            originalMessage={null}
            quotedMessage={quotedMessage}
            quotedMessageSender={quotedMessageSender}
            setQuotedMessage={setQuotedMessage}
            displayedWithMesageInput={true}
          />
        </div>
      )}
      <div
        className={`flex flex-row w-full items-center ${
          quotedMessage ? 'h-[70px]' : 'h-[114px] -mt-[1px]'
        }`}
      >
        <form className={`flex grow`} onSubmit={e => handleSend(e)}>
          <input
            className={`flex grow rounded-md border border-neutral-300 h-[50px] mr-1 ${
              quotedMessage ? '' : 'my-8'
            } ml-6 px-6 text-sm focus:ring-1 focus:ring-inputring outline-none placeholder:text-neutral-500`}
            ref={inputRef}
            placeholder={`${activeChannelRestrictions?.mute ? 'You are Muted in this Conversation' : activeChannelRestrictions?.ban ? `You are Banned from this Conversation ${activeChannelRestrictions.reason && `(${activeChannelRestrictions.reason})`}` : 'Type message'}`}
            value={text}
            disabled={activeChannelRestrictions?.mute || activeChannelRestrictions?.ban}
            onChange={e => {
              handleTyping(e)
            }}
          />
        </form>
        {!replyInThread && (
          <div
            className={`cursor-pointer hover:bg-neutral-100 hover:rounded-md ${(activeChannelRestrictions?.mute || activeChannelRestrictions?.ban) && 'pointer-events-none'}`}
            onClick={e => handleSend(e) } 
          >
            <Image
              src={`${
                (activeChannelRestrictions?.mute || activeChannelRestrictions?.ban) ? '/icons/chat-assets/do_not_disturb.svg' : currentlyEditingMessage
                  ? '/icons/chat-assets/save.svg'
                  : '/icons/chat-assets/send.svg'
              }`}
              alt={`${currentlyEditingMessage ? 'Save' : 'Send'}`}
              className='m-3 cursor-pointer'
              width={24}
              height={24}
              priority
            />
          </div>
        )}
        {!replyInThread && (
          <div
            className={`cursor-pointer hover:bg-neutral-100 hover:rounded-md ${(activeChannelRestrictions?.mute || activeChannelRestrictions?.ban) && 'pointer-events-none'}`}
            onClick={() => {
              if (currentlyEditingMessage) {
                setText('')
                setCurrentlyEditingMessage(null)
              } else {
                addEmoji()
              }
            }} 
          >
            <Image
              src={`${
                (activeChannelRestrictions?.mute || activeChannelRestrictions?.ban) ? '/icons/chat-assets/do_not_disturb.svg' : currentlyEditingMessage
                  ? '/icons/chat-assets/close.svg'
                  : '/icons/chat-assets/smile.svg'
              }`}
              alt='Smile'
              className='m-3 cursor-pointer'
              width={24}
              height={24}
              priority
            />
          </div>
        )}
        {!replyInThread && appConfiguration?.message_send_file == true && (
          <div
            className={`cursor-pointer hover:bg-neutral-100 hover:rounded-md relative ${(activeChannelRestrictions?.mute || activeChannelRestrictions?.ban) && 'pointer-events-none'}`}
            onClick={() => {
              addAttachment()
            }}
          >
            <input type='file' className='hidden' />
            {attachmentsCount > 0 && (
              <div className='absolute right-0 top-0'>
                <UnreadIndicator count={attachmentsCount} />
              </div>
            )}
            <Image
              src={`${
                (activeChannelRestrictions?.mute || activeChannelRestrictions?.ban) ? '/icons/chat-assets/do_not_disturb.svg' : showUploadSpinner
                  ? '/icons/chat-assets/loading.png'
                  : '/icons/chat-assets/attachment.svg'
              }`}
              alt='Attachment'
              className={`m-3 cursor-pointer ${
                showUploadSpinner && 'animate-spin'
              }`}
              width={24}
              height={24}
              priority
            />
          </div>
        )}
        {replyInThread && (
          <div
            className='cursor-pointer hover:bg-neutral-100 hover:rounded-md'
            onClick={e => handleSend(e)}
          >
            <Image
              src='/icons/chat-assets/plus.svg'
              alt='Plus'
              className='m-3'
              width={14}
              height={14}
              priority
            />
          </div>
        )}
      </div>
    </div>
  )
}
