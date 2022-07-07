import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { nanoid } from 'nanoid';
import React from 'react';
import { useGlobalContext } from '../../../context/ContextProvider';
import { TypeBoard } from '../../../Model/model';

type props = {
  board : TypeBoard
}

export const BoardClosedItem : React.FC<props> = ({board}) => {
  const {setRefresh, history} = useGlobalContext();

  const onClickHandle = ()=>{
    const url = `/board/closed/${board.uid as string}`;
    setRefresh(true);
    history.push(url);
  };

  return (
    <IonCard key={nanoid()} onClick={()=>onClickHandle()} >
      <IonCardHeader>
        <IonCardTitle>{board.boardName}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {board.boardDescription}
      </IonCardContent>
    </IonCard>
  );
};
