import Image from 'next/image'
import ToolTip from './toolTip'
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
  emojiClick = null,
  replyInThreadClick = null,
  quoteMessageClick = null,
  pinMessageClick = null,
  forwardMessageClick = null,
  editMessageClick = null,
  deleteMessageClick = null,
  reportMessageClick = null
}) {
  const [copyToolTip, setCopyToolTip] = useState(false)

  const [emoteToolTip, setEmoteToolTip] = useState(false)
  const [quoteToolTip, setQuoteToolTip] = useState(false)
  const [pinToolTip, setPinToolTip] = useState(false)
  const [replyToolTip, setReplyToolTip] = useState(false)
  const [forwardToolTip, setForwardToolTip] = useState(false)
  const [editToolTip, setEditToolTip] = useState(false)
  const [deleteToolTip, setDeleteToolTip] = useState(false)
  const [reportToolTip, setReportToolTip] = useState(false)

  const handleMessageActionsMouseEnter = e => {
    messageActionsEnter()
  }
  const handleMessageActionsMouseLeave = e => {
    messageActionsLeave()
  }

  return (
    <div className={`${!received && 'relative self-start'}`}>
      {emojiPickerShown && (
        <MessageActionsEmoji
          received={received}
          onEmojiClick={emoji => emojiClick(emoji)}
        ></MessageActionsEmoji>
      )}
      <div
        className={`absolute flex flex-row p-2 gap-1 z-10 rounded-sm shadow-lg bg-white mr-24 ${
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
            iconUrl='/icons/smile.svg'
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
            iconUrl='/icons/quote.svg'
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
            iconUrl='/icons/pin.svg'
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
            iconUrl='/icons/reply.svg'
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
            iconUrl='/icons/forward.svg'
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
            iconUrl='/icons/edit.svg'
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
            iconUrl='/icons/delete.svg'
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
            iconUrl='/icons/report.svg'
            iconAlt='Report'
          ></MessageAction>
        )}
      </div>
    </div>
  )
}
