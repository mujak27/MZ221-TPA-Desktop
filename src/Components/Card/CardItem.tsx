import { IonCard, IonModal, IonTitle } from '@ionic/react';
import { doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useFirestoreDocData } from 'reactfire';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeCard } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';
import { CardDetail } from './CardDetail';

type props = {
  cardUid : string
  index : number
  // ref : Ref<Draggable>
}

export const CardItem : React.FC<props> = ({cardUid, index}) => {
  const [showDetail, setShowDetail] = useState(false);
  const firestore = useGlobalContext().firestore;
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();
  // const [refItem, setRef] = useRef(ref);

  const refCard= doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards, cardUid);
  const {status: statusCard, data: resCard } = useFirestoreDocData(refCard, {
    idField: 'uid',
  });

  if (statusCard == 'loading') {
    return (
      <>
        <IonCard>
          <IonTitle>loading...</IonTitle>
        </IonCard>
      </>
    );
  }


  const card = resCard as TypeCard;


  const openDetail = ()=>{
    setShowDetail(true);
  };

  const closeDetail = ()=>{
    setShowDetail(false);
  };


  const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: white;
  `;

  return (
    <Draggable draggableId={card.uid as string} index={index}>
      {(provided)=>{
        return (
          <Container ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <IonCard style={{margin: '0', padding: '8px'}} onClick={openDetail}>
              <IonTitle>{card.cardTitle}</IonTitle>
            </IonCard>
            <IonModal isOpen={ showDetail } onWillDismiss={(data:any)=>{
              console.log(data);
            }} onDidDismiss={()=>{
              setShowDetail(false);
            }} >
              <CardDetail card={card} exitHandle={closeDetail} />
            </IonModal>
          </Container>
        );
      }}
    </Draggable>

  );
};

