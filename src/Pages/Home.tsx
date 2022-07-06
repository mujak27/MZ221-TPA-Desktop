import { collection, query, where } from 'firebase/firestore';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { BoardItem } from '../Components/Board/BoardItem';
import { useGlobalContext } from '../context/ContextProvider';
import { KeyBoard, Tables, TypeBoard } from '../Model/model';


const Home = () => {
  const {user, firestore} = useGlobalContext();

  const refFavBoards = collection(firestore, Tables.Boards);
  const {status:statusFavBoards, data:resFavBoards} = useFirestoreCollectionData(
    query(refFavBoards, where(KeyBoard.boardFavoritedBy, 'array-contains', user.userUid)), {
    idField: 'uid'
    }
  )

  if(statusFavBoards === 'loading') {
    return <>fetching home data...</>
  }

  const favBoards = resFavBoards as Array<TypeBoard>;


  return (
    <div>
      this is home
      {
        favBoards.map((favBoard)=>{
          return <BoardItem board={favBoard} />
        })
      }
    </div>
  );
};

export { Home };

