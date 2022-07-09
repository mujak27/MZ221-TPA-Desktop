import { collection, doc, DocumentReference, serverTimestamp } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { BoardStatus, BoardVisibility, Tables, TypeBoard, TypeGroup, TypeTag } from '../../Model/model';

type TypeBoardContext = {
  board : TypeBoard,
  groups : TypeGroup[],
  refBoard : DocumentReference | string,
  tags : TypeTag[],
  selectedTags : TypeTag[],
  setSelectedTags : React.Dispatch<React.SetStateAction<TypeTag[]>>
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
    boardTagUids: [],
  } as TypeBoard,
  groups: [],
  refBoard: '',
  tags: [],
  selectedTags: [],
  setSelectedTags: '' as unknown as React.Dispatch<React.SetStateAction<TypeTag[]>>,
});

export const useBoardContext = ()=>{
  return useContext(boardContext);
};


type props = {
  children : React.ReactNode | React.ReactNode[]
}

export const BoardContext : React.FC<props> = ({children}) => {
  const {firestore, setRefresh} = useGlobalContext();

  const {boardUid} = useParams() as {boardUid : string};

  const [selectedTags, setSelectedTags] = useState<TypeTag[]>([]);
  const [x, setX] = useState(true);

  useEffect(()=>{
    setX(!x);
    console.info(x);
    console.info('board change detected');
  }, [selectedTags])

  const refBoard = doc(firestore, Tables.Boards, boardUid);
  const {status: statusBoard, data: resBoard} = useFirestoreDocData(refBoard, {
    idField: 'uid',
  });

  const refGroups = collection(firestore, Tables.Boards, boardUid, Tables.Groups);
  const {status: statusGroups, data: resGroups} = useFirestoreCollectionData(refGroups, {
    idField: 'uid',
  });

  const refTags = collection(firestore, Tables.Boards, boardUid, Tables.Tags);
  const {status : statusTags, data : resTags} = useFirestoreCollectionData(refTags, {
    idField: 'uid',
  })

  if (statusBoard === 'loading' || statusGroups === 'loading' || statusTags === 'loading') {
    return <div>checking board authorization...</div>;
  }

  if (!resBoard) {
    return <div>inalid url or you do not have access to the board</div>;
  }


  const tags = resTags as TypeTag[];
  const board = resBoard as TypeBoard;
  const groups = resGroups as TypeGroup[];
  boardContext = createContext<TypeBoardContext>({board, groups, refBoard, tags, selectedTags: selectedTags, setSelectedTags: setSelectedTags});


  return (
    <>
      {x ? children : null}
      {!x ? children : null}
    </>
  );
};
