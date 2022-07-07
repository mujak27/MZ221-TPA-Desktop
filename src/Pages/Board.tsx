import { IonHeader, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { collection, query, where } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React from 'react';
import { Route } from 'react-router';
import { useFirestoreCollectionData } from 'reactfire';
import { BoardItem } from '../Components/Board/BoardItem';
import { BoardClosedDetail } from '../Components/Board/Closed/BoardClosedDetail';
import { BoardClosedItem } from '../Components/Board/Closed/BoardClosedItem';
import { useGlobalContext } from '../context/ContextProvider';
import { BoardStatus, KeyBoard, Tables, TypeBoard } from '../Model/model';


const Board = () => {
  const {firestore, user} = useGlobalContext();

  // for all board owned
  const refBoards = collection(firestore, Tables.Boards);
  const {status : statusBoards, data : resBoards} = useFirestoreCollectionData(query(
    refBoards, 
    where(KeyBoard.boardMembers, 'array-contains', user.userUid),
    where(KeyBoard.boardStatus, '==', BoardStatus.Open),
    ), {
    idField: 'uid'
  })
  
  // for all closed board which he is admin
  const refClosedBoards = collection(firestore, Tables.Boards);
  const {status : statusClosedBoards, data : resClosedBoards} = useFirestoreCollectionData(query(
    refClosedBoards, 
    where(KeyBoard.boardAdmins, 'array-contains', user.userUid),
    where(KeyBoard.boardStatus, '==', BoardStatus.Close),
  ),{
    idField: 'uid'
  });

  if(statusBoards === 'loading' || statusClosedBoards === 'loading'){
    return <>fetching board data...</>
  }

  const boards = resBoards as Array<TypeBoard>;
  const closedBoards = resClosedBoards as Array<TypeBoard>;


  return (
    <>
      <IonReactRouter>
        <IonRouterOutlet id='main'>
          <Route path='/board/closed/:boardUid'>
            <BoardClosedDetail />
          </Route>
          <Route path='/board' exact>
            <IonHeader>boards</IonHeader>
            {
              boards.map((board)=>{
                return <BoardItem key={nanoid()} board={board} />
              })
            }
            <IonHeader>Closed boards</IonHeader>
            {
              closedBoards.map((closedBoard)=>{
                return <BoardClosedItem key={nanoid()} board={closedBoard} />
              })
            }
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </>
  );
};

export { Board };

