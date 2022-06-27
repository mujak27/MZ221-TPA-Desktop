import { IonTitle } from '@ionic/react';
import { collection } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeCard, TypeComment } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { CommentItem } from '../Comment/CommentItem';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';
import { CardCreateComment } from './CardCreateComment';

type props = {
  card : TypeCard,
}

export const CardComments : React.FC<props> = ({card}) => {

  const {firestore} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();
  
  const refComments = collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards, card.uid as string, Tables.Comments);
  const {status : statusComments, data : resComments} = useFirestoreCollectionData(refComments, {
    idField: 'uid'
  });

  if(statusComments === 'loading'){
    return <>fetching comments data..</>
  }

  const comments = resComments as Array<TypeComment>;

  return (
    <>
      <IonTitle className='ion-padding'>Comments : </IonTitle>
      <div className='ion-padding-start ion-padding-top'>
        <CardCreateComment card={card} />
        {
          comments.map((comment)=>{
            return (<CommentItem card={card} key={nanoid()} comment={comment} />)
          }) 
        }
        {/* < onAddHandle={onAddhandle} /> */}
      </div>
    </>
  );
};
