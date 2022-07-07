/* eslint-disable no-unused-vars */
import { DocumentReference, FieldValue } from 'firebase/firestore';

export enum Tables {
  Workspaces = 'Workspaces',
  Boards = 'Boards',
  Groups = 'Groups',
  Cards = 'Cards',
  Members = 'Members',
  Users = 'Users',
  InvitationLink = 'InvitationLink',
  Comments = 'Comments',
  Notifications = 'Notifications',
}

export enum Key {
  docUid = '__name__'
}

export enum enumNotifFreq {
  Instant = 'Instant',
  Periodically = 'Periodically',
  Never = 'Never'
}

export enum EnumItemType {
  Workspace = 'Workspace',
  Board = 'Board',
}

export enum WorkspaceVisibility {
  Public = 'Public',
  Workspace = 'Workspace',
}

export enum BoardVisibility {
  Public = 'Public',
  Workspace = 'Workspace',
  Board = 'Board',
}

export enum BoardStatus {
  Open = 'Open',
  Close = 'Close',
}

export enum KeyUser {
  userUid = 'userUid',
  userName = 'userName',
  userEmail = 'userEmail',
  userNotifFreq = 'userNotifFreq',
  userInvitation = 'userInvitation',
}

export type TypeInvitation = {
  itemUid : string,
  itemRef : DocumentReference,
  invitationType : EnumItemType,
}

export type TypeNotification = {
  notificationValue : string,
}

export type TypeUser = {
  uid? : string,
  userUid : string
  userName : string,
  userImageLink : string,
  userBio : string,
  userEmail : string,
  userNotifFreq : enumNotifFreq,
  userNotifications : Array<String>
  userInvitation : Array<TypeInvitation>
}

// export enum KeyMember {
//   userUid = 'userUid',
//   isAdmin = 'isAdmin',
//   isOwner = 'isOwner',
// }

// export type TypeMember = {
//   uid? : string,
//   userUid : string,
//   isAdmin : boolean,
//   isOwner : boolean,
//   userName? : string
// }

export enum KeyChecklist {
  checklistDone = 'checklistDone',
  checklistName = 'checklistName',
}

export type TypeCheckList = {
  checklistDone : boolean
  checklistName : string
}

export type TypeCommentReply = {
  userUid : string
  replyValue : string
}

export type TypeComment = {
  uid? : string
  commentOwnerUid : string
  userUids : Array<string>,
  commentValue : string
  commentReplies : Array<TypeCommentReply>
  commentMentions : Array<string>
}

// userUids -> yg reply juga masuk ke sini
// comment
// commentReplies -> array string
// userMention array string 

export enum KeyCard {
  cardTitle = 'cardTitle',
  cardDescription = 'cardDescription',
  cardCreatedDate = 'cardCreatedDate',
  cardChecklists = 'cardChecklists',
}


export type TypeCard = {
  uid? : string
  cardTitle : string
  cardDescription : string
  cardCreatedDate : FieldValue
  cardChecklists : Array<TypeCheckList>
  cardWatchers : Array<string>
  cardDate : number
};

export enum KeyGroup {
  groupName = 'groupName',
  boardUid = 'boardUid',
  groupCreatedDate = 'groupCreatedDate',
}

export type TypeGroup = {
  uid? : string
  groupName : string,
  groupCreatedDate : FieldValue,
  groupCardUids : Array<string>,
}

export enum KeyBoard {
  workspaceUid = 'workspaceUid',
  boardName = 'boardName',
  boardDescription = 'boardDescription',
  boardStatus = 'boardStatus',
  boardVisibility = 'boardVisibility',
  boardCreatedDate = 'boardCreatedDate',
  boardMembers = 'boardMembers',
  boardAdmins = 'boardAdmins',
  boardWorkspaceUid = 'boardWorkspaceUid',
  boardFavoritedBy = 'boardFavoritedBy'
}

export type TypeBoard = {
  uid? : string
  boardName : string
  boardDescription : string
  boardStatus : BoardStatus
  boardVisibility : BoardVisibility
  boardCreatedDate : FieldValue
  boardMembers : Array<string>
  boardAdmins: Array<string>
  boardGroupUids : Array<string>
  boardDeleteRequest : Array<string>
  boardLogs : Array<string>
  boardWorkspaceUid : string
  boardFavoritedBy : Array<string>
}

export enum KeyWorkspace {
  workspaceName = 'workspaceName',
  workspaceVisibility = 'workspaceVisibility',
  workspaceCreatedDate = 'workspaceCreatedDate',
  workspaceMembers = 'workspaceMembers',
  workspaceDescription = 'workspaceDescription',
}

export type TypeWorkspace = {
  uid? : string
  workspaceName : string
  workspaceDescription : string
  workspaceVisibility : WorkspaceVisibility
  workspaceCreatedDate : number
  workspaceMembers : Array<string>
  workspaceAdmins: Array<string>
  workspaceDeleteRequest : Array<string>
  workspaceLogs : Array<string>
  workspaceBoardUids: Array<string>
}

export type TypeInvitationLink = {
  uid? : string,
  InvitationType : EnumItemType,
  refItem : DocumentReference,
  InvitationExpired : number,
}

