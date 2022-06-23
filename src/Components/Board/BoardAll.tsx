import { collection, query, where } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables } from '../../Model/model';

type props = {

}

export const BoardAll:React.FC<props> = () : React.ReactElement=>{
  const globalContext = useGlobalContext();
  const firestore = globalContext.firestore;
  const userUid = globalContext.user.userUid;

  const boardRef = collection(firestore, Tables.Boards);
  const {status: boardsStatus, data: boards} = useFirestoreCollectionData(query(boardRef, ...[
    where('boardMembers', 'array-contains-any', [
      {memberIsAdmin: true, memberUserUid: userUid},
      {memberIsAdmin: false, memberUserUid: userUid},
    ]),
  ]), {
    idField: 'uid',
  });

  if (boardsStatus === 'loading') {
    return <>loading user data...</>;
  }


  return (
    <div>
        Board All
      {boards.map((board)=>{
        return (
          <div key={nanoid()}>
            {board.boardName}
          </div>
        );
      })}
    </div>
  );
};
