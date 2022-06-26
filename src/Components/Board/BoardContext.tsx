import { collection, doc, query, serverTimestamp } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { BoardStatus, BoardVisibility, Tables, TypeBoard, TypeGroup, TypeMember } from '../../Model/model';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';

type TypeBoardContext = {
  board : TypeBoard,
  userBoard : TypeMember,
  groups : TypeGroup[],
  boardMembers: Array<TypeMember>
}

let boardContext = createContext<TypeBoardContext>({
  board: {
    boardName: '',
    boardDescription: '',
    boardMembers: [],
    boardCreatedDate: serverTimestamp(),
    boardStatus: BoardStatus.Open,
    boardVisibility: BoardVisibility.Board,
    boardGroupUids: [],
    boardLogs: [],
    boardDeleteRequest: [],
  } as TypeBoard,
  userBoard : {
    isAdmin: false,
    isOwner: false,
    userUid: '',
  },
  groups: [],
  boardMembers: [],
});

export const useBoardContext = ()=>{
  return useContext(boardContext);
};


type props = {
  children : React.ReactNode | React.ReactNode[]
}

export const BoardContext : React.FC<props> = ({children}) => {
  const {firestore, user} = useGlobalContext();
  const {workspace} = useWorkspaceContext();

  const {boardUid} = useParams() as {boardUid : string};


  const refBoard = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, boardUid);
  const {status: statusBoard, data: resBoard} = useFirestoreDocData(refBoard, {
    idField: 'uid',
  });

  const refGroups = collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, boardUid, Tables.Groups);
  const {status: statusGroups, data: resGroups} = useFirestoreCollectionData(refGroups, {
    idField: 'uid',
  });

  
  const refMember = collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, boardUid, Tables.Members);
  const {status: statusMember, data: resMembers} = useFirestoreCollectionData(query(
      refMember,
  ), {
    idField: 'uid'
  });

  if (statusBoard === 'loading' || statusGroups === 'loading' || statusMember === 'loading') {
    return <div>checking board authorization...</div>;
  }

  if (!resBoard) {
    return <div>inalid url or you do not have access to the board</div>;
  }


  const board = resBoard as TypeBoard;
  const groups = resGroups as TypeGroup[];
  const boardMembers = resMembers as Array<TypeMember>;
  const userBoard = boardMembers.filter((member)=>{
    return member.userUid == user.userUid as string
  })[0];
  boardContext = createContext<TypeBoardContext>({board, groups, boardMembers, userBoard});


  return (
    <>
      {children}
    </>
  );
};
