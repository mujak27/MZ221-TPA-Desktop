import { IonCol, IonGrid, IonItem, IonRow, IonTitle } from '@ionic/react';
import { collection, query, where } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { KeyBoard, Tables, TypeBoard } from '../../Model/model';
import { BoardItem } from '../Board/BoardItem';
import '../style.css';
import { useWorkspaceContext } from './WorkspaceContext';
import WorkspaceCreateBoard from './WorkspaceCreateBoard';


type props = {
}

export const WorkspaceBoards : React.FC<props> = ({}) => {
  const globalContext = useGlobalContext();
  const firestore = globalContext.firestore;
  const user = globalContext.user;
  const {workspace} = useWorkspaceContext();

  const boardRef = collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards);
  const {status: statusBoard, data: resBoards} = useFirestoreCollectionData(query(boardRef,
      where(KeyBoard.boardMembers, 'array-contains', user.userUid),
  ), {
    idField: 'uid',
  });

  const boards = resBoards as Array<TypeBoard>;

  if (statusBoard === 'loading') {
    return (
      <div>
        loading board data
      </div>
    );
  }


  const ItemInRow = 6;
  const boardJsx = boards.map((board)=>{
    return (
      <IonCol size={`${12/ItemInRow}`} key={nanoid()}>
        <BoardItem board={board} />
      </IonCol>
    );
  });

  console.info('========')
  const boardJsxChunkGenerator = ()=>{
    const source = boardJsx;
    const res : Array<JSX.Element> = [];
    for(let i=0; i < source.length; i+=ItemInRow){
      const chunk = source.slice(i, i+ItemInRow);
      res.push((
        <IonRow>
          {(chunk)}
        </IonRow>
      ))
    }
    return res;
  }
  const boardJsxChunk = boardJsxChunkGenerator();


  return (
    <div>
      <IonItem>
        <IonTitle >
          <h3 style={{width: '100%', display: 'block'}}>
          Boards
          </h3>
        </IonTitle>
      </IonItem>
      <WorkspaceCreateBoard/>
      {/* <div className='flexContainer'> */}
      <IonGrid>
        {
          boardJsxChunk
        }
      </IonGrid>
      {/* </div> */}
    </div>
  );
};
