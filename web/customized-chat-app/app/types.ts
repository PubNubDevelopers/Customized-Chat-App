import { Channel } from "@pubnub/chat";

export enum ChatNameModals {
  UNDEFINED = "undefined",
  USER = "user",
  CHANNEL = "channel",
}

export enum MessageActionsTypes {
  REPLY_IN_THREAD = "reply",
  QUOTE = "quote",
  PIN = "pin",
  COPY = "copy",
  SHOW_EMOJI = "show_emoji",
  REPORT = "report",
  EDIT = "edit",
  DELETE = "delete",
  FORWARD = "forward",
}

export enum ChatHeaderActionIcon {
  MARK_READ = 0,
  ADD = 1,
  NONE = 2,
}

export interface UnreadMessagesOnChannel {
  channel: Channel;
  count: number;
}

export enum ToastType {
  INFO = 0,
  CHECK = 1,
  ERROR = 2,
}

export enum PresenceIcon {
  NOT_SHOWN = -1,
  OFFLINE = 0,
  ONLINE = 1,
}

export enum ChatEventTypes {
  LEAVE = 0, //  Notify other members of a group that you are leaving that group
  JOINED = 3, //  Notify others in a group that you have joined as a new member (for public channels)
}

export type Restriction = {
  ban: boolean;
  mute: boolean;
  reason: string | number | boolean | undefined;
};

export type ThemeColors = {
  //  This app was originally written to support customizable colours for both
  //  light and dark mode.  The current implementation only uses a single colour
  //  scheme however (assumed to be 'light' mode, but customizable to any colours)
  //  App does not respond to system settings.
  app_appearance: string;   //  'light' or 'dark' (but see note above)
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  accent: string;
  accentDark: string;
};

export const Backgrounds = [
  {
    name: "Chat Icons (Light)",
    backgroundImage: "url('/backgrounds/chat_icons.png')",
    backgroundPosition: "initial",
    url: '/backgrounds/chat_icons.png',
    color: "#525252"
  },
  {
    name: "Chat Icons (Dark Theme)",
    backgroundImage: "url('/backgrounds/chat_icons_inverted.png')",
    backgroundPosition: "initial",
    url: '/backgrounds/chat_icons_inverted.png',
    color: "#FFFFFF"
  },
  {
    name: "Plain White",
    backgroundImage: "url('/backgrounds/default.png')",
    backgroundPosition: "initial",
    url: '/backgrounds/default.png',
    color: "#525252"
  },
  {
    name: "Plain Black",
    backgroundImage: "url('/backgrounds/black.png')",
    backgroundPosition: "initial",
    url: '/backgrounds/black.png',
    color: "#FFFFFF"
  },
  {
    name: "PubNub Office",
    backgroundImage: "url('/backgrounds/couch.jpg')",
    backgroundPosition: "center center",
    url: '/backgrounds/couch.jpg',
    color: "#FFFFFF"
  },
];

//  Credit: https://gist.github.com/gabrielmlinassi/234519eacaf73f75812b48ea3e94ee6e
//  Used to only minimze the chat selection pane if we are running on a small screen
import { useState, useEffect, useLayoutEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => window.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// -------------------------
// useBreakpoints

export function useBreakpoints() {
  const [isClient, setIsClient] = useState(false);

  const breakpoints = {
    isXs: useMediaQuery("(max-width: 640px)"),
    isSm: useMediaQuery("(min-width: 641px) and (max-width: 768px)"),
    isMd: useMediaQuery("(min-width: 769px) and (max-width: 1024px)"),
    isLg: useMediaQuery("(min-width: 1025px)"),
    active: "SSR",
  };

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  if (isClient && breakpoints.isXs) breakpoints.active = "xs";
  if (isClient && breakpoints.isSm) breakpoints.active = "sm";
  if (isClient && breakpoints.isMd) breakpoints.active = "md";
  if (isClient && breakpoints.isLg) breakpoints.active = "lg";

  return breakpoints;
}

export function giveUserAvatarUrl(userArray, currentUserId) {
  if (!userArray) {
    return "/avatars/placeholder.png";
  }
  return userArray?.find((user) => user.id !== currentUserId)?.profileUrl
    ? userArray?.find((user) => user.id !== currentUserId)?.profileUrl
    : "/avatars/placeholder.png";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function giveGroupAvatarUrl(currentUserProfileUrl) {
  return "/group/generic-group.png";
}

export function givePublicAvatarUrl(channel) {
  return channel?.custom?.profileUrl ?? "/avatars/placeholder.png";
}

export function giveUserName(searchArray, currentUserId) {
  return (
    searchArray?.find((item) => item.id !== currentUserId)?.name ??
    "User Left Conversation"
  );
}

export function findIndex(searchArray, idToSearchFor) {
  return searchArray.findIndex((item) => item.id == idToSearchFor);
}
