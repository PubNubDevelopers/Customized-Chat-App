/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import {
  Channel,
  Chat,
  Membership,
  User,
  ThreadChannel,
  Message as pnMessage
} from '@pubnub/chat'
import Image from 'next/image'
import { roboto } from '@/app/fonts'
import Header from '../ui-components/header'
import ChatSelectionMenu from '../ui-components/chatSelectionMenu'
import MessageList from '../ui-components/messageList'
import MessageListThread from '../ui-components/messageListThread'
import MessageInput from '../ui-components/messageInput'
import NewMessageGroup from '../ui-components/newMessageGroup'
import UserMessage from '../ui-components/userMessage'
import ProfileScreen from '../ui-components/profileScreen'
import TypingIndicator from '../ui-components/typingIndicator'
import ChatSettingsScreen from '../ui-components/chatSettingsScreen'
import ModalChangeName from '../ui-components/modalChangeName'
import ModalManageMembers from '../ui-components/modalManageMembers'
import ModalReportMessage from '../ui-components/modalReportMessage'
import searchImg from '@/public/icons/chat-assets/search.svg'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {
  ChatNameModals,
  MessageActionsTypes,
  ChatHeaderActionIcon,
  ToastType,
  ChatEventTypes,
  UnreadMessagesOnChannel,
  PresenceIcon
} from '../../types'
import { buildConfig } from '../../configuration'

export default function ChatScreen ({ embeddedDemoConfig, configuration }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appConfiguration, setAppConfiguration] = useState<any | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>('')
  const [chat, setChat] = useState<Chat | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loadMessage, setLoadMessage] = useState('Demo is initializing...')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState('')

  const [showThread, setShowThread] = useState(false)
  const [profileScreenVisible, setProfileScreenVisible] = useState(false)
  const [chatSettingsScreenVisible, setChatSettingsScreenVisible] =
    useState(false)
  const [chatSelectionMenuMinimized, setChatSelectionMenuMinimized] =
    useState(false)
  const [creatingNewMessage, setCreatingNewMessage] = useState(false)
  const [changeUserNameModalVisible, setChangeUserNameModalVisible] =
    useState(false)
  const [changeChatNameModalVisible, setChangeChatNameModalVisible] =
    useState(false)
  const [manageMembersModalVisible, setManageMembersModalVisible] =
    useState(false)
  const [reportedMessage, setReportedMessage] = useState<pnMessage | null>(null)
  const [reportMessageModalVisible, setReportMessageModalVisible] =
    useState(false)
  const [currentlyEditingMessage, setCurrentlyEditingMessage] = useState<pnMessage | null>(null)

  const [name, setName] = useState('')
  const [profileUrl, setProfileUrl] = useState('')
  const [typingData, setTypingData] = useState<string[]>([])

  const [userMsg, setUserMsg] = useState({
    message: 'Message Text.  Message Text.  ',
    title: 'Please Note:',
    href: 'http://www.pubnub.com',
    type: 0
  })
  const [userMsgShown, setUserMsgShown] = useState(false)
  const [userMsgTimeoutId, setUserMsgTimeoutId] = useState(0)
  //const [refreshMembersTimeoutId, setRefreshMembersTimeoutId] =
  //  useState<ReturnType<typeof setTimeout>>()
  let refreshMembersTimeoutId
  //const [initOnce, setInitOnce] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const [quotedMessage, setQuotedMessage] = useState<pnMessage | null>(null)
  const [quotedMessageSender, setQuotedMessageSender] = useState('')
  const [typingUsers, setTypingUsers] = useState<string | null>(null)

  //  State of the channels I'm a member of (left hand pane)
  const [publicChannels, setPublicChannels] = useState<Channel[]>()
  const [privateGroups, setPrivateGroups] = useState<Channel[]>()
  const [directChats, setDirectChats] = useState<Channel[]>()
  //  My memberships for channels
  const [publicChannelsMemberships, setPublicChannelsMemberships] =
    useState<Membership[]>()
  const [privateGroupsMemberships, setPrivateGroupsMemberships] =
    useState<Membership[]>()
  const [directChatsMemberships, setDirectChatsMemberships] =
    useState<Membership[]>()

  //const [publicChannelsUsers, setPublicChannelsUsers] = useState<User[][]>([])
  const [privateGroupsUsers, setPrivateGroupsUsers] = useState<User[][]>([])
  const [directChatsUsers, setDirectChatsUsers] = useState<User[][]>([])
  const [allUsers, setAllUsers] = useState<User[]>()
  const [activeChannelUsers, setActiveChannelUsers] = useState<User[]>([])
  const [activeChannelGroupMembership, setActiveChannelGroupMembership] =
    useState<Membership[]>([])
  const [unreadMessages, setUnreadMessages] = useState<
    UnreadMessagesOnChannel[]
  >([])

  //  State of the currently active Channel
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const [activeChannelPinnedMessage, setActiveChannelPinnedMessage] =
    useState<pnMessage | null>(null)
  const [activeThreadChannel, setActiveThreadChannel] =
    useState<ThreadChannel | null>(null)
  const [activeThreadMessage, setActiveThreadMessage] =
    useState<pnMessage | null>(null)

  function updateUnreadMessagesCounts () {
    chat?.getUnreadMessagesCounts({}).then(result => {
      const unreadMessagesOnChannel: UnreadMessagesOnChannel[] = []
      result.forEach((element, index) => {
        const newUnreadMessage: UnreadMessagesOnChannel = {
          channel: element.channel,
          count: element.count
        }
        unreadMessagesOnChannel.push(newUnreadMessage)
      })
      setUnreadMessages(unreadMessagesOnChannel)
    })
  }

  useEffect(() => {
    //  Configuration passed to this component has been updated
    if (configuration != null && appConfiguration != null) {
      notifyUserConfigurationChanged(
        appConfiguration?.support_push,
        configuration?.support_push,
        'Push Setting Changed',
        'The native mobile version of this application WILL support push messaging (GMS on Android, APNS on iOS',
        'The native mobile version of this application will NOT support push messaging (GMS on Android, APNS on iOS'
      )
      notifyUserConfigurationChanged(
        appConfiguration?.message_history,
        configuration?.message_history,
        'Message Persistence Changed',
        'Message History has been ENABLED',
        'Message History has been DISABLED'
      )
      notifyUserConfigurationChanged(
        appConfiguration?.view_user_profiles,
        configuration?.view_user_profiles,
        'View User Profiles Setting Changed',
        'View User Profiles has been ENABLED',
        'View User Profiles has been DISABLED'
      )
      notifyUserConfigurationChanged(
        appConfiguration?.handle_banned,
        configuration?.handle_banned,
        'Handle Banned or Muted Users Setting Changed',
        'Handle Banned / Muted Users has been ENABLED',
        'Handle Banned / Muted Users has been DISABLED'
      )
    }

    setAppConfiguration(configuration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration])

  function notifyUserConfigurationChanged (
    appConfigurationSetting,
    configurationSetting,
    messageTitle,
    setTrueMessage,
    setFalseMessage
  ) {
    if (
      appConfiguration != null &&
      appConfigurationSetting != configurationSetting
    ) {
      let userMessage = setTrueMessage
      if (configurationSetting == false) {
        userMessage = setFalseMessage
      }
      showUserMessage(messageTitle, userMessage, '', ToastType.INFO)
    }
  }

  useEffect(() => {
    //  Page loaded, determine the configuration
    //  This application can be configured in one of 3 ways:
    //  1. By passing in a prop to this component (used when this component is embedded within the config dashboard)
    //  2. At build time, by reading the values of configuration.ts
    //  3. At runtime, through a URL query param
    //  Priority: 3 > 2 > 1
    const searchParamsConfig = searchParams.get('configuration')
    setUserId(searchParams.get('userId'))
    if (searchParamsConfig != null) {
      console.log('Found runtime config')
      //  Runtime config is base64 encoded JSON object
      try {
        const jsonConfig = JSON.parse(atob(searchParamsConfig))
        setAppConfiguration(jsonConfig)
      } catch {
        console.error(
          'Provided Runtime configuration was in an unexpected format: continuing without configuration'
        )
      }
    } else if (buildConfig != null && buildConfig['publishKey'] != null) {
      console.log('Found build time config')
      //  Build time config is JSON object
      const jsonConfig = buildConfig
      setAppConfiguration(jsonConfig)
    } else if (configuration != null) {
      console.log('Found configuration passed to this component')
      console.log(configuration)
      setAppConfiguration(configuration)
    } else {
      console.log('Failed to find configuration')
    }
  }, [searchParams, router, configuration])

  useEffect(() => {
    //  Configuration is available, initialize PubNub
    async function init () {
      const localChat = await Chat.init({
        publishKey: appConfiguration.publishKey,
        subscribeKey: appConfiguration.subscribeKey,
        userId: userId,
        typingTimeout: 5000,
        storeUserActivityTimestamps: true,
        storeUserActivityInterval: 60000 //300000
      })
      setChat(localChat)
      setCurrentUser(localChat.currentUser)
      if (localChat.currentUser.name) {
        setName(localChat.currentUser.name)
      }
      if (localChat.currentUser.profileUrl) {
        setProfileUrl(localChat.currentUser.profileUrl)
      }

      //  Retrieve all users
      const localAllUsers = await localChat.getUsers()
      setAllUsers(
        localAllUsers.users.filter(
          user =>
            user.id != 'admin-config' && user.id != 'PUBNUB_INTERNAL_MODERATOR'
        )
      )

      //  Join public channels
      const localPublicChannels = await localChat.getChannels({
        filter: `type == 'public'`
      })
      if (localPublicChannels) {
        const currentPublicMemberships =
          await localChat.currentUser.getMemberships({
            filter: "channel.type == 'public'"
          })
        if (
          currentPublicMemberships &&
          currentPublicMemberships.total != null &&
          localPublicChannels.total &&
          currentPublicMemberships.total < localPublicChannels.total
        ) {
          //  There are public channels that we are not a member of, join them all
          //const localPublicChannelMemberships = []
          const localPublicChannelMemberships =
            currentPublicMemberships.memberships
          for (const publicChannel of localPublicChannels.channels) {
            if (
              !currentPublicMemberships.memberships.find(
                membership => membership.channel.id == publicChannel.id
              )
            ) {
              //  No current membership, join channel
              const newMembership = await publicChannel.join(message => {
                //  I have a message listener elsewhere for consistency with private and direct chats
              })
              localPublicChannelMemberships.push(newMembership.membership)
            }
          }
          setPublicChannelsMemberships(localPublicChannelMemberships)
        } else {
          setPublicChannelsMemberships(currentPublicMemberships.memberships)
        }
        setPublicChannels(localPublicChannels.channels)
        setActiveChannel(localPublicChannels.channels[0])
      }
      setLoaded(true)
    }

    if (chat) return
    if (!appConfiguration) return
    if (embeddedDemoConfig != null) {
      //  Any special initialization when we are running within the embedded demo?
      setPublicChannels(
        embeddedDemoConfig.channels.filter(channel => channel.type == 'public')
      )
      setPrivateGroups(
        embeddedDemoConfig.channels.filter(channel => channel.type == 'group')
      )
      setDirectChats(
        embeddedDemoConfig.channels.filter(channel => channel.type == 'direct')
      )
      const tempGroupUsers: User[][] = []
      tempGroupUsers[0] = embeddedDemoConfig.users.slice(1, 5)
      tempGroupUsers[1] = embeddedDemoConfig.users.slice(6, 9)
      setPrivateGroupsUsers(tempGroupUsers)
      const tempDirectUsers: User[][] = []
      tempDirectUsers[0] = embeddedDemoConfig.users.filter(
        user => user.name == 'David Smith'
      )
      tempDirectUsers[1] = embeddedDemoConfig.users.filter(
        user => user.name == 'James Brown'
      )
      tempDirectUsers[2] = embeddedDemoConfig.users.filter(
        user => user.name == 'Emma Lee'
      )
      setDirectChatsUsers(tempDirectUsers)
      setProfileUrl(embeddedDemoConfig.users[0].profileUrl)
      setTypingData([embeddedDemoConfig.users[1].id])
      setQuotedMessageSender('<<Sender of the Quoted Message>>')
      if (
        appConfiguration?.group_chat == true &&
        (activeChannel == null || appConfiguration?.public_channels == false)
      ) {
        setActiveChannel(
          embeddedDemoConfig.channels.find(
            channel => channel.id == 'privategroup-bike'
          )
        )
        setActiveChannelUsers(embeddedDemoConfig.users.slice(1, 5))
      } else if (
        appConfiguration?.public_channels &&
        (activeChannel == null || appConfiguration.group_chat == false)
      ) {
        setActiveChannel(
          embeddedDemoConfig.channels.find(
            channel => channel.id == 'public-general'
          )
        )
        setActiveChannelUsers(embeddedDemoConfig.users)
      }
      setUnreadMessages(embeddedDemoConfig.unreadMessages)
      return //  Do not initialize PubNub if we are within the embedded demo
    }

    if (!userId) {
      setLoadMessage('No User ID specified')
      return
    }

    if (appConfiguration?.send_receive_messages == false) {
      console.error(
        'Always expect Send / Receive messages to be configured as TRUE'
      )
    }

    if (appConfiguration?.support_push) {
      console.log(
        'Mobile Push: This web application does not support push messaging.  Native Kotlin for Android will use GCM and Native Swift for iOS will use APNS.'
      )
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfiguration, embeddedDemoConfig, userId, chat])

  useEffect(() => {
    if (!chat) return
    //  Initial loading of the groups and direct messages
    refreshGroups('group')
    refreshGroups('direct')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat])

  useEffect(() => {
    //  Connect to the direct chats whenever they change so we can keep a track of unread messages
    //  Called once everything is initialized
    if (!chat) return
    if (!activeChannel) return
    if (appConfiguration?.message_unread_count == false) return //  message counts turned off at the app level

    function updateUnreadMessagesCounts () {
      chat?.getUnreadMessagesCounts({}).then(result => {
        const unreadMessagesOnChannel: UnreadMessagesOnChannel[] = []
        result.forEach((element, index) => {
          const newUnreadMessage: UnreadMessagesOnChannel = {
            channel: element.channel,
            count: element.count
          }
          unreadMessagesOnChannel.push(newUnreadMessage)
        })
        setUnreadMessages(unreadMessagesOnChannel)
      })
    }

    const publicHandlers: (() => void)[] = []
    if (publicChannels) {
      publicChannels.forEach((channel, index) => {
        const disconnectHandler = channel.connect(message => {
          if (
            !(
              message.userId == chat.currentUser.id ||
              message.channelId == activeChannel.id
            )
          ) {
            updateUnreadMessagesCounts()
          }
        })
        publicHandlers.push(disconnectHandler)
      })
    }
    const directHandlers: (() => void)[] = []
    if (directChats) {
      directChats.forEach((channel, index) => {
        const disconnectHandler = channel.connect(message => {
          if (
            !(
              message.userId == chat.currentUser.id ||
              message.channelId == activeChannel.id
            )
          ) {
            updateUnreadMessagesCounts()
          }
        })
        directHandlers.push(disconnectHandler)
      })
    }
    const privateHandlers: (() => void)[] = []
    if (privateGroups) {
      privateGroups.forEach((channel, index) => {
        const disconnectHandler = channel.connect(message => {
          if (
            !(
              message.userId == chat.currentUser.id ||
              message.channelId == activeChannel.id
            )
          ) {
            updateUnreadMessagesCounts()
          }
        })
        privateHandlers.push(disconnectHandler)
      })
    }

    updateUnreadMessagesCounts() //  Update the unread message counts whenever the channel changes

    return () => {
      publicHandlers.forEach(handler => {
        handler()
      })
      directHandlers.forEach(handler => {
        handler()
      })
      privateHandlers.forEach(handler => {
        handler()
      })
    }
  }, [
    chat,
    publicChannels,
    directChats,
    activeChannel,
    privateGroups,
    appConfiguration?.message_unread_count
  ])

  /**  Maintain the users and group memberships for the currently active channel */
  useEffect(() => {
    if (!chat) return
    if (!activeChannel) return
    if (!allUsers) return

    let activeChannelMemberships
    if (activeChannel.type == 'public') {
      //  Note: Public channels do not use the activeChannelUsers array, they just use
      //  allUsers
      setActiveChannelUsers(allUsers)
      if (publicChannelsMemberships && publicChannelsMemberships.length > 0) {
        activeChannelMemberships = publicChannelsMemberships?.find(
          membership => membership.channel.id == activeChannel.id
        )
      }
    } else {
      //  Channel is either group or direct
      activeChannel.getMembers({}).then(membersResponse => {
        setActiveChannelUsers(
          membersResponse.members.map((membership, index) => {
            return membership.user
          })
        )
      })
      if (activeChannel.type == 'group') {
        activeChannelMemberships = privateGroupsMemberships?.find(
          membership => membership.channel.id == activeChannel.id
        )
      } else if (activeChannel.type == 'direct') {
        activeChannelMemberships = directChatsMemberships?.find(
          membership => membership.channel.id == activeChannel.id
        )
      }
    }
    if (activeChannelMemberships) {
      setActiveChannelGroupMembership(activeChannelMemberships)
    }
  }, [
    chat,
    activeChannel,
    allUsers,
    publicChannelsMemberships,
    publicChannels,
    privateGroupsMemberships,
    privateGroups,
    directChatsMemberships,
    directChats
  ])

  /**  Set the typing indicator listener and pinned messages */
  useEffect(() => {
    if (!chat) return
    if (!activeChannel) return

    //  Set the pinned message for the active channel, this returns an updated channel ID so retrieve based on the server-channel
    chat.getChannel(activeChannel.id).then(localActiveChannel => {
      localActiveChannel
        ?.getPinnedMessage()
        .then(localActiveChannelPinnedMessage => {
          setActiveChannelPinnedMessage(localActiveChannelPinnedMessage)
        })
    })

    //  Only register typing indicators for non-public channels and if this app has typing indicators enabled
    if (activeChannel.type == 'public') return
    if (appConfiguration?.typing_indicator == false) return
    return activeChannel.getTyping(value => {
      const findMe = value.indexOf(chat.currentUser.id)
      if (findMe > -1) value.splice(findMe, 1)
      setTypingData(value)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, activeChannel])

  useEffect(() => {
    //  Get updates on the current user's name and profile URL
    //  This handles updates made to the current user via BizOps workspace
    if (!currentUser) return
    return currentUser.streamUpdates(updatedUser => {
      if (updatedUser.name) {
        setName(updatedUser.name)
      }
      if (updatedUser.profileUrl) {
        setProfileUrl(updatedUser.profileUrl)
      }
    })
  }, [currentUser])

  /* Handle updates to the Public Channels */
  useEffect(() => {
    if (chat && publicChannels && publicChannels.length > 0) {
      return Channel.streamUpdatesOn(publicChannels, channels => {
        const updatedPublicChannels = publicChannels.map(
          (publicChannel, index) => {
            if (channels[index].name) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(publicChannel as any).name = channels[index].name
            }
            if (channels[index].custom?.profileUrl) {
              publicChannel.custom.profileUrl =
                channels[index].custom.profileUrl
            }
            return publicChannel
          }
        )
        setPublicChannels(updatedPublicChannels)
      })
    }
  }, [chat, publicChannels])

  /* Handle updates to the Private Groups, e.g. names changed */
  useEffect(() => {
    if (chat && privateGroups && privateGroups.length > 0) {
      return Channel.streamUpdatesOn(privateGroups, channels => {
        const updatedPrivateGroups = privateGroups.map(
          (privateGroup, index) => {
            if (channels[index].name) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(privateGroup as any).name = channels[index].name
            }
            return privateGroup
          }
        )
        setPrivateGroups(updatedPrivateGroups)
      })
    }
  }, [chat, privateGroups])

  //  Note: We do not need to stream updates on direct chats since we do not use the channel name, only the user info (name, avatar)

  /* Handle updates to any of the other users in the system */
  useEffect(() => {
    if (chat && allUsers) {
      return User.streamUpdatesOn(allUsers, allUsersUpdated => {
        applyUsersUpdateWithHysteresis(allUsersUpdated)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, allUsers])

  async function applyUsersUpdateWithHysteresis (allUsersUpdated) {
    if (!chat) return
    clearTimeout(refreshMembersTimeoutId)

    //  Wait a second to request updates, to avoid making too many requests at once
    const setTimeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
      applyUsersUpdate(allUsersUpdated)
    }, 1000)
    refreshMembersTimeoutId = setTimeoutId

    return
  }

  function applyUsersUpdate (allUsersUpdated) {
    //console.log(allUsers)
    if (!allUsers) return
    let madeUpdates = false
    const newAllUsers = allUsers.map((user, index) => {
      const updatedUser = allUsersUpdated.find(
        updatedUser => updatedUser.id == user.id
      )
      //  I test here whether the updated values are null, this was to accommodate a bug in an earlier
      //  version of the Chat SDK which has since been fixed (in 0.9.1)
      if (updatedUser.name && updatedUser.name != user.name) {
        madeUpdates = true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(user as any).name = updatedUser.name
      }
      if (updatedUser.profileUrl && updatedUser.profileUrl != user.profileUrl) {
        madeUpdates = true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(user as any).profileUrl = updatedUser.profileUrl
      }
      if (updatedUser.lastActiveTimestamp != user.lastActiveTimestamp) {
        //  User activity has changed (do not update our own user)
        if (updatedUser.id != currentUser?.id) {
          madeUpdates = true
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(user as any).lastActiveTimestamp = updatedUser.lastActiveTimestamp
        }
      }
      return user
    })
    if (madeUpdates) {
      setAllUsers(newAllUsers)
    }

    //  Update direct names on the left-hand side
    refreshGroups('direct', true)
  }

  /* Listen for events using the Chat event mechanism*/
  useEffect(() => {
    if (!chat) return
    //if (!activeChannel) return
    const removeCustomListener = chat.listenForEvents({
      channel: chat.currentUser.id,
      type: 'custom',
      method: 'publish',
      callback: async evt => {
        switch (evt.payload.action) {
          case ChatEventTypes.LEAVE:
            //  Someone is telling us they are leaving a group
            if (evt.payload.body.isDirectChat) {
              //  Our partner left the direct chat, leave it ourselves
              const channel = await chat.getChannel(evt.payload.body.channelId)
              await channel?.leave()
              if (activeChannel?.id === evt.payload.body.channelId) {
                if (publicChannels && publicChannels.length > 0) {
                  setActiveChannel(publicChannels[0])
                } else {
                  setActiveChannel(null)
                }
              }
            }
            refreshGroups(evt.payload.body.isDirectChat ? 'direct' : 'group')
            break
        }
      }
    })

    const removeModerationListener = chat.listenForEvents({
      channel: chat.currentUser.id,
      type: 'moderation',
      callback: async evt => {
        console.log(appConfiguration?.handle_banned)
        if (appConfiguration?.handle_banned == true) {
          let moderationMessage = ''
          let notificationSeverity: ToastType = ToastType.INFO
          if (evt.payload.restriction == 'muted') {
            moderationMessage = `You have been MUTED by the administrator`
            notificationSeverity = ToastType.ERROR
          } else if (evt.payload.restriction == 'banned') {
            moderationMessage = `You have been BANNED by the administrator for the following reason: ${evt.payload.reason}`
            notificationSeverity = ToastType.ERROR
          } else if (evt.payload.restriction == 'lifted') {
            moderationMessage = `Your previous restrictions have been LIFTED by the administrator`
            notificationSeverity = ToastType.CHECK
          }
          showUserMessage(
            'Moderation Event:',
            moderationMessage,
            'https://www.pubnub.com/how-to/monitor-and-moderate-conversations-with-bizops-workspace/',
            notificationSeverity
          )
        }
      }
    })

    const removeMentionsListener = chat.listenForEvents({
      user: chat.currentUser.id,
      type: 'mention',
      callback: async evt => {
        const channelId = evt.payload.channel
        const messageTimetoken = evt.payload.messageTimetoken
        const channel = await chat.getChannel(channelId)
        const message = await channel?.getMessage(messageTimetoken)
        showUserMessage(
          'You Were Mentioned:',
          'You have been mentioned in the following message: ' +
            message?.content.text,
          'https://www.pubnub.com/docs/chat/chat-sdk/build/features/custom-events#events-for-mentions',
          ToastType.INFO
        )
      }
    })

    const removeInvite = chat.listenForEvents({
      channel: chat.currentUser.id,
      type: 'invite',
      callback: async evt => {
        console.log('we have been invited to a channel')
        //  Somebody has added us to a new group chat or DM
        const channelType = evt.payload.channelType
        refreshGroups(channelType)
      }
    })

    return () => {
      removeCustomListener()
      removeModerationListener()
      removeMentionsListener()
      removeInvite()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChannel, chat, publicChannels, appConfiguration?.handle_banned])

  //  Function called when we need to update the private or direct groups because
  //  e.g. we have been added to a group
  async function refreshGroups (groupType, onlyUpdateUsers = false) {
    if (!chat) return
    if (groupType == 'group') {
      const tempGroupUsers: User[][] = []
      const privateGroupMemberships = await chat.currentUser.getMemberships({
        filter: "channel.type == 'group'",
        sort: { updated: 'desc' }
      })
      if (
        privateGroupMemberships &&
        privateGroupMemberships.memberships.length > 0
      ) {
        const currentMemberOfTheseGroupChannels =
          privateGroupMemberships.memberships.map(m => m.channel)
        if (!onlyUpdateUsers) {
          setPrivateGroups(currentMemberOfTheseGroupChannels)
          setPrivateGroupsMemberships(privateGroupMemberships?.memberships)
        }
        //  Get the users for every private group I am a member of

        for (
          let indexGroup = 0;
          indexGroup < currentMemberOfTheseGroupChannels.length;
          indexGroup++
        ) {
          const tempIndex = indexGroup
          const response = await currentMemberOfTheseGroupChannels[
            indexGroup
          ].getMembers({ sort: { updated: 'desc' }, limit: 100 })
          if (response.members) {
            const channelUsers = response.members.map((membership, index) => {
              return membership.user
            })
            tempGroupUsers[tempIndex] = channelUsers
          }
        }
        setPrivateGroupsUsers(tempGroupUsers)
      } else {
        //  Not a member of any private groups
        setPrivateGroupsUsers(tempGroupUsers)
        if (!onlyUpdateUsers) {
          setPrivateGroupsMemberships([])
          setPrivateGroups([])
        }
      }
    } else if (groupType == 'direct') {
      const tempDirectUsers: User[][] = []
      const directChannelMemberships = await chat.currentUser.getMemberships({
        filter: "channel.type == 'direct'",
        sort: { updated: 'desc' }
      })
      if (
        directChannelMemberships &&
        directChannelMemberships.memberships.length > 0
      ) {
        const currentMemberOfTheseDirectChannels =
          directChannelMemberships.memberships.map(m => m.channel)
        if (!onlyUpdateUsers) {
          setDirectChats(currentMemberOfTheseDirectChannels)
          setDirectChatsMemberships(directChannelMemberships?.memberships)
        }
        for (
          let indexDirects = 0;
          indexDirects < currentMemberOfTheseDirectChannels.length;
          indexDirects++
        ) {
          const tempIndex = indexDirects
          const response = await currentMemberOfTheseDirectChannels[
            indexDirects
          ].getMembers({ sort: { updated: 'desc' }, limit: 100 })

          if (response.members) {
            //  response contains the most recent 100 members
            const channelUsers = response.members.map((membership, index) => {
              return membership.user
            })
            tempDirectUsers[tempIndex] = channelUsers
          }
        }
        setDirectChatsUsers(tempDirectUsers)
      } else {
        //  Not a member of any direct channels
        setDirectChatsUsers(tempDirectUsers)
        if (!onlyUpdateUsers) {
          setDirectChatsMemberships([])
          setDirectChats([])
        }
      }
    }
    updateUnreadMessagesCounts()
  }

  function sendChatEvent (
    eventType: ChatEventTypes,
    recipients: User[],
    payload
  ) {
    recipients.forEach(async recipient => {
      //  Don't send the message to myself
      if (recipient.id !== chat?.currentUser.id) {
        await chat?.emitEvent({
          channel: recipient.id,
          type: 'custom',
          method: 'publish',
          payload: {
            action: eventType,
            body: payload
          }
        })
      }
    })
  }

  //  Handler for the message actions which show when you hover over each message
  async function messageActionHandler (action, data) {
    switch (action) {
      case MessageActionsTypes.REPLY_IN_THREAD:
        setShowThread(true)
        setChatSelectionMenuMinimized(true)
        if (embeddedDemoConfig != null) return
        //  The data parameter is the message we are to reply to
        if (!data.hasThread) {
          setActiveThreadChannel(await data.createThread())
        } else {
          setActiveThreadChannel(await data.getThread())
        }
        setActiveThreadMessage(data)
        break
      case MessageActionsTypes.QUOTE:
        setQuotedMessage(data)
        chat?.getUser(data.userId).then(user => {
          if (user && user.name) {
            setQuotedMessageSender(user.name)
          }
        })
        break
      case MessageActionsTypes.PIN:
        if (embeddedDemoConfig != null) return
        if (activeChannel) {
          //  The data parameter is the message we are to reply to
          let localActiveChannel = await chat?.getChannel(activeChannel?.id)
          const localActiveChannelPinnedMessage =
            await localActiveChannel?.getPinnedMessage()
          //  Check whether we need to unpin an existing message first
          if (localActiveChannelPinnedMessage) {
            localActiveChannel = await localActiveChannel?.unpinMessage()
          } else {
            //  There was no message, so did not unpin anything'
          }
          //  Channel now has no pinned message.  Pin the requested message if it is different from
          //  the one we just unpinned
          if (localActiveChannelPinnedMessage?.timetoken != data.timetoken) {
            localActiveChannel = await localActiveChannel?.pinMessage(data)
            showUserMessage(
              'Message Pinned:',
              'The Message has been pinned to the top of ' + activeChannel.name,
              'https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/pinned',
              ToastType.CHECK
            )
          }
        }
        break
      case MessageActionsTypes.REPORT:
        setReportedMessage(data)
        setReportMessageModalVisible(true)
        break
      case MessageActionsTypes.EDIT:
        setCurrentlyEditingMessage(data)
        break;
      case MessageActionsTypes.DELETE:
        if (embeddedDemoConfig) return
        const updatedMessage = await data?.delete({soft: true}, {preserveFiles: true})
        break;
      case MessageActionsTypes.COPY:
        showUserMessage('Copied', `${data.text}`, '', ToastType.CHECK)
        break
    }
  }

  function logout () {
    const configuration = searchParams.get('configuration')
    if (configuration) {
      router.replace(`/?configuration=${configuration}`)
    } else {
      router.replace(`/`)
    }
  }

  function showUserMessage (
    title: string,
    message: string,
    href: string,
    type = ToastType.INFO
  ) {
    clearTimeout(userMsgTimeoutId)
    setUserMsg({ message: message, href: href, title: title, type: type })
    setUserMsgShown(true)
    const timeoutId = window.setTimeout(setUserMsgShown, 7000, false)
    setUserMsgTimeoutId(timeoutId)
  }

  function closeUserMessage () {
    clearTimeout(userMsgTimeoutId)
    setUserMsgShown(false)
  }

  async function chatSettingsLeaveButtonClick () {
    if (embeddedDemoConfig != null) {
      setChatSettingsScreenVisible(false)
      return
    }
    if (activeChannel) {
      sendChatEvent(
        ChatEventTypes.LEAVE,
        activeChannel.type == 'group' && privateGroups
          ? privateGroupsUsers[
              privateGroups.findIndex(group => group.id == activeChannel?.id)
            ]
          : activeChannel.type == 'direct' && directChats
          ? directChatsUsers[
              directChats.findIndex(
                dmChannel => dmChannel.id == activeChannel?.id
              )
            ]
          : [],
        {
          userLeaving: chat?.currentUser.id,
          isDirectChat: activeChannel.type != 'group',
          channelId: activeChannel.id
        }
      )
      const channelType = activeChannel.type

      await activeChannel.leave()
      //showUserMessage(
      //  'You Left:',
      //  'You have left this group, please select a different channel or create a new group / DM',
      //  'https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/updates#update-channel-details'
      //)
      if (publicChannels && publicChannels.length > 0) {
        setActiveChannel(publicChannels[0])
      } else {
        setActiveChannel(null)
      }
      setChatSettingsScreenVisible(false)

      refreshGroups(channelType)
    }
  }

  if (embeddedDemoConfig == null && !chat) {
    return (
      <main>
        <div className='flex flex-col w-full h-screen justify-center items-center'>
          <div className='max-w-96 max-h-96 '>
            <Image
              src='/chat-logo.svg'
              alt='Chat Icon'
              className=''
              width={1000}
              height={1000}
              priority
            />
          </div>
          <div className='flex mb-5 animate-spin'>
            <Image
              src='/icons/chat-assets/loading.png'
              alt='Chat Icon'
              className=''
              width={50}
              height={50}
              priority
            />
          </div>
          <div className='text-2xl select-none'>{loadMessage}</div>
        </div>
      </main>
    )
  }

  return (
    <main
      className={`overscroll-none overflow-y-hidden ${
        embeddedDemoConfig != null && ''
      }`}
    >
      <ProfileScreen
        profileScreenVisible={profileScreenVisible}
        setProfileScreenVisible={setProfileScreenVisible}
        changeUserNameScreenVisible={changeUserNameModalVisible}
        name={name}
        profileUrl={profileUrl}
        logout={() => logout()}
        changeName={() => {
          setChangeUserNameModalVisible(true)
        }}
        showUserMessage={showUserMessage}
      />
      <ChatSettingsScreen
        chatSettingsScreenVisible={
          chatSettingsScreenVisible && appConfiguration?.edit_channel_details
        }
        setChatSettingsScreenVisible={setChatSettingsScreenVisible}
        changeChatNameScreenVisible={changeChatNameModalVisible}
        manageMembersModalVisible={manageMembersModalVisible}
        isDirectChat={activeChannel?.type == 'direct'}
        activeChannel={activeChannel}
        activeChannelUsers={activeChannelUsers}
        buttonAction={async () => {
          chatSettingsLeaveButtonClick()
        }}
        changeChatNameAction={() => {
          setChangeChatNameModalVisible(true)
        }}
        manageMembershipsAction={() => {
          setManageMembersModalVisible(true)
        }}
        embeddedDemoConfig={embeddedDemoConfig}
        appConfiguration={appConfiguration}
      />
      {/* Modal to change the Chat group name*/}
      {
        <ModalChangeName
          name={name}
          activeChannel={activeChannel}
          modalType={ChatNameModals.CHANNEL}
          showUserMessage={showUserMessage}
          saveAction={async newName => {
            await activeChannel?.update({
              name: newName
            })
            showUserMessage(
              'Channel Name Changed',
              'The channel name has been successfully updated',
              'https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/updates#update-channel-details',
              ToastType.CHECK
            )
          }}
          changeNameModalVisible={changeChatNameModalVisible}
          setChangeNameModalVisible={setChangeChatNameModalVisible}
        />
      }
      {
        <ModalManageMembers
          activeChannelUsers={activeChannelUsers}
          saveAction={() => {
            setManageMembersModalVisible(false)
          }}
          manageMembersModalVisible={manageMembersModalVisible}
          setManageMembersModalVisible={setManageMembersModalVisible}
          appConfiguration={appConfiguration}
        />
      }
      {/* Modal to change the user name */}
      {
        <ModalChangeName
          name={name}
          activeChannel={null}
          modalType={ChatNameModals.USER}
          saveAction={async newName => {
            if (chat) {
              const newUser = await chat.currentUser.update({
                name: newName
              })
              setCurrentUser(newUser)
              setName(newName)
              showUserMessage(
                'Name Changed',
                'Your name has been successfully updated',
                'https://www.pubnub.com/docs/chat/chat-sdk/build/features/users/updates#update-user-details',
                ToastType.CHECK
              )
            }
          }}
          showUserMessage={showUserMessage}
          changeNameModalVisible={changeUserNameModalVisible}
          setChangeNameModalVisible={setChangeUserNameModalVisible}
        />
      }
      {/* Modal to specify the reason for reporting a message */}
      <ModalReportMessage
        message={reportedMessage}
        reportAction={async reportReason => {
          if (embeddedDemoConfig != null) {
            setReportMessageModalVisible(false)
            return
          }
          const reportResult = await reportedMessage?.report(reportReason)
          showUserMessage(
            'Message Reported:',
            'Report successfully sent.  You can see all message reports in the Channel Monitor view of BizOps Workspace',
            'https://www.pubnub.com/docs/bizops-workspace/channel-monitor',
            ToastType.INFO
          )
        }}
        reportMessageModalVisible={reportMessageModalVisible}
        setReportMessageModalVisible={setReportMessageModalVisible}
      />

      {embeddedDemoConfig == null && (
        <Header
          currentUser={currentUser}
          setProfileScreenVisible={setProfileScreenVisible}
          setCreatingNewMessage={setCreatingNewMessage}
          appConfiguration={appConfiguration}
        />
      )}
      <UserMessage
        userMsgShown={userMsgShown}
        title={userMsg.title}
        message={userMsg.message}
        href={userMsg.href}
        type={userMsg.type}
        closeToastAction={() => {
          closeUserMessage()
        }}
      />
      {
        <div
          className={`${
            !showEmojiPicker && 'hidden'
          } absolute right-4 bottom-28 z-50 bg-white border-2 rounded-lg shadow-md`}
        >
          <Picker
            data={data}
            sheetRows={3}
            previewPosition={'none'}
            navPosition={'top'}
            searchPosition={'top'}
            maxFrequentRows={0}
            onEmojiSelect={data => {
              setSelectedEmoji(data.native)
              setShowEmojiPicker(false)
            }}
            onClickOutside={() => {
              setShowEmojiPicker(false)
            }}
          />
        </div>
      }
      <div
        id='chat-main'
        className={`flex flex-row ${
          embeddedDemoConfig != null ? 'max-h-[750px]' : 'min-h-screen h-screen'
        } overscroll-none  ${
          (profileScreenVisible ||
            (chatSettingsScreenVisible &&
              appConfiguration.edit_channel_details) ||
            changeChatNameModalVisible ||
            manageMembersModalVisible ||
            reportMessageModalVisible) &&
          'blur-sm opacity-40'
        }`}
      >
        <ChatSelectionMenu
          chatSelectionMenuMinimized={chatSelectionMenuMinimized}
          setChatSelectionMenuMinimized={setChatSelectionMenuMinimized}
          setShowThread={setShowThread}
          chat={chat}
          currentUserId={
            embeddedDemoConfig
              ? embeddedDemoConfig.users[0].id
              : chat?.currentUser.id
          }
          setCreatingNewMessage={setCreatingNewMessage}
          unreadMessages={unreadMessages}
          publicChannels={publicChannels}
          publicChannelsMemberships={publicChannelsMemberships}
          privateGroups={privateGroups}
          privateGroupsUsers={privateGroupsUsers}
          privateGroupsMemberships={privateGroupsMemberships}
          directChats={directChats}
          directChatsUsers={directChatsUsers}
          directChatsMemberships={directChatsMemberships}
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
          setActiveChannelUsers={setActiveChannelUsers}
          setActiveChannelPinnedMessage={setActiveChannelPinnedMessage}
          updateUnreadMessagesCounts={() => {
            updateUnreadMessagesCounts()
          }}
          currentUserProfileUrl={profileUrl}
          showUserMessage={showUserMessage}
          appConfiguration={appConfiguration}
          embeddedDemoConfig={embeddedDemoConfig}
        />
        <div className='relative w-full bg-white'>
          <div
            id='chats-main'
            className={`flex flex-col grow w-full max-h-screen py-0 ${
              embeddedDemoConfig == null ? 'mt-[64px]' : ''
            } bg-white`}
          >
            {embeddedDemoConfig == null &&
            appConfiguration?.group_chat &&
            creatingNewMessage ? (
              <NewMessageGroup
                chat={chat}
                currentUser={currentUser}
                setCreatingNewMessage={setCreatingNewMessage}
                showUserMessage={showUserMessage}
                invokeRefresh={(desiredChannelId, createdType) => {
                  refreshGroups(createdType)
                }}
                setActiveChannel={setActiveChannel}
              />
            ) : (
              <MessageList
                loaded={loaded}
                activeChannel={activeChannel}
                currentUser={
                  embeddedDemoConfig != null
                    ? embeddedDemoConfig.users[0]
                    : chat?.currentUser
                }
                groupUsers={
                  activeChannel?.type == 'public'
                    ? allUsers
                    : activeChannelUsers
                }
                groupMembership={activeChannelGroupMembership}
                messageActionHandler={(action, vars) =>
                  messageActionHandler(action, vars)
                }
                updateUnreadMessagesCounts={() => {
                  updateUnreadMessagesCounts()
                }}
                setChatSettingsScreenVisible={setChatSettingsScreenVisible}
                quotedMessage={quotedMessage}
                activeChannelPinnedMessage={
                  embeddedDemoConfig != null
                    ? embeddedDemoConfig.pinnedMessage.message
                    : activeChannelPinnedMessage
                }
                setActiveChannelPinnedMessage={setActiveChannelPinnedMessage}
                showUserMessage={showUserMessage}
                allUsers={allUsers}
                embeddedDemoConfig={embeddedDemoConfig}
                appConfiguration={appConfiguration}
              />
            )}
            {!quotedMessage &&
              typingData &&
              typingData.length > 0 &&
              appConfiguration?.typing_indicator == true &&
              activeChannel?.type !== 'public' && (
                <TypingIndicator
                  typers={typingData}
                  users={activeChannelUsers}
                  appConfiguration={appConfiguration}
                />
              )}

            <div
              className={`${
                embeddedDemoConfig == null && creatingNewMessage && 'hidden'
              } absolute bottom-0 left-0 right-0 bg-white`}
            >
              <MessageInput
                activeChannel={activeChannel}
                replyInThread={false}
                quotedMessage={quotedMessage}
                quotedMessageSender={quotedMessageSender}
                setQuotedMessage={setQuotedMessage}
                //creatingNewMessage={creatingNewMessage}
                showUserMessage={showUserMessage}
                setShowEmojiPicker={() => {
                  setTimeout(function () {
                    setShowEmojiPicker(!showEmojiPicker)
                  }, 50)
                }}
                selectedEmoji={selectedEmoji}
                setSelectedEmoji={setSelectedEmoji}
                currentlyEditingMessage={currentlyEditingMessage}
                setCurrentlyEditingMessage={setCurrentlyEditingMessage}
                embeddedDemoConfig={embeddedDemoConfig}
                appConfiguration={appConfiguration}
              />
            </div>
          </div>
        </div>
        <MessageListThread
          showThread={
            showThread &&
            !creatingNewMessage &&
            appConfiguration?.message_threads == true
          }
          setShowThread={setShowThread}
          setChatSelectionMenuMinimized={setChatSelectionMenuMinimized}
          activeThreadChannel={activeThreadChannel}
          activeThreadMessage={activeThreadMessage}
          currentUser={chat?.currentUser}
          groupUsers={activeChannelUsers}
          embeddedDemoConfig={embeddedDemoConfig}
          appConfiguration={appConfiguration}
        />
      </div>
    </main>
  )
}
