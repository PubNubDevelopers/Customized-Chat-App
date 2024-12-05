import { useState } from 'react'
import MessageAction from './messageAction'
import MessageActionsEmoji from './messageActionsEmoji'

export default function MessageActions ({
  received,
  actionsShown,
  emojiPickerShown,
  setEmojiPickerShown,
  isPinned,
  messageActionsEnter,
  messageActionsLeave,
  emojiClick,
  replyInThreadClick,
  quoteMessageClick,
  pinMessageClick,
  forwardMessageClick,
  editMessageClick,
  deleteMessageClick,
  reportMessageClick
}) {
  const [emoteToolTip, setEmoteToolTip] = useState(false)
  const [quoteToolTip, setQuoteToolTip] = useState(false)
  const [pinToolTip, setPinToolTip] = useState(false)
  const [replyToolTip, setReplyToolTip] = useState(false)
  const [forwardToolTip, setForwardToolTip] = useState(false)
  const [editToolTip, setEditToolTip] = useState(false)
  const [deleteToolTip, setDeleteToolTip] = useState(false)
  const [reportToolTip, setReportToolTip] = useState(false)

  const handleMessageActionsMouseEnter = () => {
    messageActionsEnter()
  }
  const handleMessageActionsMouseLeave = () => {
    messageActionsLeave()
  }

  return (
    <div className={`${!received && 'relative self-start'} select-none`}>
      {emojiPickerShown && (
        <MessageActionsEmoji
          received={received}
          onEmojiClick={emoji => emojiClick(emoji)}
        ></MessageActionsEmoji>
      )}
      <div
        className={`absolute flex flex-row p-2 gap-1 z-10 rounded-sm shadow-lg bg-white mr-24 select-none ${
          received ? 'right-[50px]' : 'left-[10px]'
        } ${received ? '-bottom-[50px]' : '-bottom-[35px]'} cursor-pointer ${
          !actionsShown && 'hidden'
        } `}
        onMouseEnter={handleMessageActionsMouseEnter}
        onMouseLeave={handleMessageActionsMouseLeave}
      >
        {emojiClick != null && (
          <MessageAction
            emojiPickerShown={emojiPickerShown}
            messageActionClickHandler={() =>
              setEmojiPickerShown(!emojiPickerShown)
            }
            toolTipText='React to message'
            toolTipVisible={emoteToolTip}
            setToolTipVisible={setEmoteToolTip}
            iconUrl='/icons/chat-assets/smile.svg'
            iconAlt='Smile'
          ></MessageAction>
        )}

        {quoteMessageClick != null && (
          <MessageAction
            emojiPickerShown={emojiPickerShown}
            messageActionClickHandler={() => quoteMessageClick()}
            toolTipText='Quote Message'
            toolTipVisible={quoteToolTip}
            setToolTipVisible={setQuoteToolTip}
            iconUrl='/icons/chat-assets/quote.svg'
            iconAlt='Quote'
          ></MessageAction>
        )}

        {pinMessageClick != null && (
          <MessageAction
            emojiPickerShown={emojiPickerShown}
            messageActionClickHandler={() => pinMessageClick()}
            toolTipText={`${isPinned ? 'Unpin message' : 'Pin message'}`}
            toolTipVisible={pinToolTip}
            setToolTipVisible={setPinToolTip}
            iconUrl='/icons/chat-assets/pin.svg'
            iconAlt='Pin'
          ></MessageAction>
        )}

        {replyInThreadClick != null && (
          <MessageAction
            emojiPickerShown={emojiPickerShown}
            messageActionClickHandler={() => replyInThreadClick()}
            toolTipText='Reply in thread'
            toolTipVisible={replyToolTip}
            setToolTipVisible={setReplyToolTip}
            iconUrl='/icons/chat-assets/reply.svg'
            iconAlt='Reply'
          ></MessageAction>
        )}

        {forwardMessageClick != null && (
          <MessageAction
            emojiPickerShown={emojiPickerShown}
            messageActionClickHandler={() => forwardMessageClick()}
            toolTipText='Forward Message'
            toolTipVisible={forwardToolTip}
            setToolTipVisible={setForwardToolTip}
            iconUrl='/icons/chat-assets/forward.svg'
            iconAlt='Reply'
          ></MessageAction>
        )}

        {editMessageClick != null && (
          <MessageAction
            emojiPickerShown={emojiPickerShown}
            messageActionClickHandler={() => editMessageClick()}
            toolTipText='Edit Message'
            toolTipVisible={editToolTip}
            setToolTipVisible={setEditToolTip}
            iconUrl='/icons/chat-assets/edit.svg'
            iconAlt='Edit'
          ></MessageAction>
        )}

        {deleteMessageClick != null && (
          <MessageAction
            emojiPickerShown={emojiPickerShown}
            messageActionClickHandler={() => deleteMessageClick()}
            toolTipText='Delete Message'
            toolTipVisible={deleteToolTip}
            setToolTipVisible={setDeleteToolTip}
            iconUrl='/icons/chat-assets/delete.svg'
            iconAlt='Delete'
          ></MessageAction>
        )}

        {reportMessageClick != null && (
          <MessageAction
            emojiPickerShown={emojiPickerShown}
            messageActionClickHandler={() => reportMessageClick()}
            toolTipText='Report Message'
            toolTipVisible={reportToolTip}
            setToolTipVisible={setReportToolTip}
            iconUrl='/icons/chat-assets/report.svg'
            iconAlt='Report'
          ></MessageAction>
        )}
      </div>
    </div>
  )
}
