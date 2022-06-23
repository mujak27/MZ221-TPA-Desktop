import { IonTitle } from '@ionic/react';
import { nanoid } from 'nanoid';
import React from 'react';
import { TypeCard, TypeCheckList } from '../../Model/model';
import { ChecklistItem } from '../Checklist/ChecklistItem';
import { CardCreateChecklist } from './CardCreateChecklist';

type props = {
  card : TypeCard,
  checklists : TypeCheckList[],
  setChecklists : React.Dispatch<React.SetStateAction<TypeCheckList[]>>,
}

export const CardChecklists : React.FC<props> = ({card, checklists, setChecklists}) => {
  if (!card.cardChecklists) return null;

  const onChangehandle = (_index : number, done : boolean)=>{
    setChecklists(
        checklists.map((checklist, index)=>{
          if (index==_index) {
            return {...checklist, checklistDone: done};
          }
          return checklist;
        }),
    );
  };

  const onRemoveHandle = (_index : number)=>{
    console.log(_index);
    setChecklists(
        checklists.filter((_, index)=>{
          if (index==_index) {
            return false;
          }
          return true;
        }),
    );
  };

  const onAddhandle = (checklistName : string)=>{
    setChecklists(
        [
          ...checklists,
          {
            checklistDone: false,
            checklistName: checklistName,
          } as TypeCheckList,
        ],
    );
  };

  console.log(checklists);

  return (
    <>
      <IonTitle className='ion-padding'>Checklists : </IonTitle>
      <div className='ion-padding-start'>
        {checklists.map((checklist, index)=>{
          return <ChecklistItem key={nanoid()} checklist={checklist} index={index} onRemoveHandle={onRemoveHandle} onChangeHandle={onChangehandle}/>;
        })}
        <CardCreateChecklist onAddHandle={onAddhandle} />
      </div>
    </>
  );
};
