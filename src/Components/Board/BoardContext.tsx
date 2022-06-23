import { collection, doc, serverTimestamp } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { BoardStatus, BoardVisibility, Tables, TypeBoard, TypeGroup } from '../../Model/model';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';

type TypeBoardContext = {
  board : TypeBoard,
  groups : TypeGroup[],
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
  } as TypeBoard,
  groups: [],
});

export const useBoardContext = ()=>{
  return useContext(boardContext);
};


type props = {
  children : React.ReactNode | React.ReactNode[]
}

export const BoardContext : React.FC<props> = ({children}) => {
  const globalContext = useGlobalContext();
  const firestore = globalContext.firestore;
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

  if (statusBoard === 'loading' || statusGroups === 'loading') {
    return <div>checking authorization...</div>;
  }

  if (!resBoard) {
    return <div>inalid url or you do not have access</div>;
  }


  const board = resBoard as TypeBoard;
  const groups = resGroups as TypeGroup[];
  boardContext = createContext<TypeBoardContext>({board, groups});


  return (
    <>
      {children}
    </>
  );
};
