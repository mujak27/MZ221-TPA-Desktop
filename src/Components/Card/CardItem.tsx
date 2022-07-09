import { IonCard, IonItem, IonModal, IonTitle } from '@ionic/react';
import { doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useFirestoreDocData } from 'reactfire';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeCard } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { CardDetail } from './CardDetail';

type props = {
  cardUid : string
  index : number
  filter : string
}

export const CardItem : React.FC<props> = ({filter, cardUid, index}) => {
  const {firestore, user} = useGlobalContext();
  const {board, selectedTags} = useBoardContext();

  const [showDetail, setShowDetail] = useState(false);

  const refCard= doc(firestore, Tables.Boards, board.uid as string, Tables.Cards, cardUid);
  const {status: statusCard, data: resCard } = useFirestoreDocData(refCard, {
    idField: 'uid',
  });

  const openDetail = ()=>{
    setShowDetail(true);
  };

  const closeDetail = ()=>{
    setShowDetail(false);
  };

  useEffect(()=>{
    console.info('selected tags changed');
  }, [selectedTags]);


  const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: white;
  `;

  if (statusCard == 'loading') {
    return (
      <>
        <IonCard>
          <IonTitle>loading...</IonTitle>
        </IonCard>
      </>
    );
  }

  if(!resCard) return null;

  
  
  const card = resCard as TypeCard;
  
  console.info('card rerendered');
  
  if(!card.cardTitle.includes(filter))return null;
  let valid = true;
  selectedTags.forEach((selectedTag)=>{
    if(!(card.cardTagUids.includes(selectedTag.uid as string))) valid = false;
  })
  console.info('check' + card.cardTitle);
  console.info(selectedTags)
  console.info(card.cardTagUids);
  if(!valid) return null

  return (
    <Draggable draggableId={card.uid as string} index={index}>
      {(provided)=>{
        return (
          <Container ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <IonCard style={{margin: '0', padding: '8px'}} onClick={openDetail}>
              <IonItem>
                <IonTitle>{card.cardTitle}</IonTitle>
              </IonItem>
            </IonCard>
            {
              board.boardMembers.includes(user.userUid) ?
              (
              <IonModal cssClass='sc-ion-modal-lg-s' isOpen={ showDetail} onDidDismiss={()=>{
                setShowDetail(false);
              }} >
                <CardDetail card={card} exitHandle={closeDetail} />
              </IonModal>
              ) : null
            }
          </Container>
        );
      }}
    </Draggable>
  );
};

