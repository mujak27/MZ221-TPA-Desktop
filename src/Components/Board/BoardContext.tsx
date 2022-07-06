import { collection, doc, DocumentReference, query, serverTimestamp } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { BoardStatus, BoardVisibility, Tables, TypeBoard, TypeGroup, TypeMember } from '../../Model/model';

type TypeBoardContext = {
  board : TypeBoard,
  userBoard : TypeMember,
  groups : TypeGroup[],
  boardMembers: Array<TypeMember>,
  refBoard : DocumentReference | string,
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
    boardWorkspaceUid: '',
    boardFavoritedBy: [],
  } as TypeBoard,
  userBoard : {
    isAdmin: false,
    isOwner: false,
    userUid: '',
  },
  groups: [],
  boardMembers: [],
  refBoard: '',
});

export const useBoardContext = ()=>{
  return useContext(boardContext);
};


type props = {
  children : React.ReactNode | React.ReactNode[]
}

export const BoardContext : React.FC<props> = ({children}) => {
  const {firestore, user, users} = useGlobalContext();

  const {boardUid} = useParams() as {boardUid : string};


  const refBoard = doc(firestore, Tables.Boards, boardUid);
  const {status: statusBoard, data: resBoard} = useFirestoreDocData(refBoard, {
    idField: 'uid',
  });

  const refGroups = collection(firestore, Tables.Boards, boardUid, Tables.Groups);
  const {status: statusGroups, data: resGroups} = useFirestoreCollectionData(refGroups, {
    idField: 'uid',
  });

  
  const refMember = collection(firestore, Tables.Boards, boardUid, Tables.Members);
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
  let boardMembers = (resMembers as Array<TypeMember>)
  boardMembers.map((resMember)=>{
    resMember.userName = users.filter((user)=>{
      return user.userUid == resMember.userUid
    })[0].userName;
  })
  const userBoard = boardMembers.filter((member)=>{
    return member.userUid == user.userUid as string
  })[0];
  console.info(boardMembers);
  boardContext = createContext<TypeBoardContext>({board, groups, boardMembers, userBoard, refBoard});


  return (
    <>
      {children}
    </>
  );
};
