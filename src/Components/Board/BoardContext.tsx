import { collection, doc, DocumentReference, serverTimestamp } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { BoardStatus, BoardVisibility, Tables, TypeBoard, TypeGroup } from '../../Model/model';

type TypeBoardContext = {
  board : TypeBoard,
  groups : TypeGroup[],
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
    boardAdmins: [],
  } as TypeBoard,
  groups: [],
  refBoard: '',
});

export const useBoardContext = ()=>{
  return useContext(boardContext);
};


type props = {
  children : React.ReactNode | React.ReactNode[]
}

export const BoardContext : React.FC<props> = ({children}) => {
  const {firestore} = useGlobalContext();

  const {boardUid} = useParams() as {boardUid : string};


  const refBoard = doc(firestore, Tables.Boards, boardUid);
  const {status: statusBoard, data: resBoard} = useFirestoreDocData(refBoard, {
    idField: 'uid',
  });

  const refGroups = collection(firestore, Tables.Boards, boardUid, Tables.Groups);
  const {status: statusGroups, data: resGroups} = useFirestoreCollectionData(refGroups, {
    idField: 'uid',
  });

  if (statusBoard === 'loading' || statusGroups === 'loading') {
    return <div>checking board authorization...</div>;
  }

  if (!resBoard) {
    return <div>inalid url or you do not have access to the board</div>;
  }


  const board = resBoard as TypeBoard;
  const groups = resGroups as TypeGroup[];
  boardContext = createContext<TypeBoardContext>({board, groups, refBoard});


  return (
    <>
      {children}
    </>
  );
};
