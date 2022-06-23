/* eslint-disable no-unused-vars */
import { FieldValue } from 'firebase/firestore';

export enum Tables {
  Workspaces = 'Workspaces',
  Boards = 'Boards',
  Groups = 'Groups',
  Cards = 'Cards',
  Members = 'Members',
  Users = 'Users',
}

export enum Key {
  docUid = '__name__'
}

export enum UserNotif {
  instant = 'instant',
  periodically = 'periodically',
  never = 'never'
}

export enum ItemType {
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
  userNotifications = 'userNotifications',
  userInvitation = 'userInvitation',
}

export type UserInvitation = {
  itemUid : string,
  invitationType : ItemType,
  invitationDeadline : FieldValue,
}

export type TypeUser = {
  userUid : string,
  userName : string,
  userEmail : string,
  userNotifFreq : UserNotif,
  userNotifications : Array<String>
  userInvitation : Array<UserInvitation>
}

export enum KeyMember {
  userUid = 'userUid',
  isAdmin = 'isAdmin',
  isOwner = 'isOwner',
}

export type TypeMember = {
  userUid : string,
  isAdmin : boolean,
  isOwner : boolean,
}

export enum KeyChecklist {
  checklistDone = 'checklistDone',
  checklistName = 'checklistName',
}

export type TypeCheckList = {
  checklistDone : boolean,
  checklistName : string,
}

export enum KeyCard {
  cardTitle = 'cardTitle',
  cardDescription = 'cardDescription',
  cardCreatedDate = 'cardCreatedDate',
  cardChecklists = 'cardChecklists',
}

export type TypeCard = {
  uid? : string
  cardTitle : string,
  cardDescription : string,
  cardCreatedDate : FieldValue,
  cardChecklists : Array<TypeCheckList>,
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
}

export type TypeBoard = {
  uid? : string,
  boardName : string,
  boardDescription : string,
  boardStatus : BoardStatus,
  boardVisibility : BoardVisibility
  boardCreatedDate : FieldValue,
  boardMembers : Array<string>,
  boardGroupUids : Array<string>
}

export enum KeyWorkspace {
  workspaceName = 'workspaceName',
  workspaceVisibility = 'workspaceVisibility',
  workspaceCreatedDate = 'workspaceCreatedDate',
  workspaceMembers = 'workspaceMembers',
  workspaceDescription = 'workspaceDescription',
}

export type TypeWorkspace = {
  uid? : string,
  workspaceName : string,
  workspaceDescription : string,
  workspaceVisibility : WorkspaceVisibility,
  workspaceCreatedDate : FieldValue,
  workspaceMembers : Array<string>,
}
