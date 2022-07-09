import { IonButton, IonChip, IonItem } from '@ionic/react';
import { uniq } from 'lodash';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useBoardContext } from '../../Board/BoardContext';

type props = {
  cardTagUids : Array<string>,
  setCardTagUids : React.Dispatch<React.SetStateAction<string[]>>,
}

export const CardTags : React.FC<props> = ({cardTagUids, setCardTagUids}) => {
  const {tags} = useBoardContext();

  const [newTagName, setNewTagName] = useState('');

  const onAddTag = ()=>{
    const newTagUid = tags.filter((tag)=>{return tag.TagName == newTagName})[0].uid as string;

    setCardTagUids(uniq([
      ...cardTagUids,
      newTagUid,
    ]))
  }

  const onRemoveTag = (removeTagUid : string)=>{
    setCardTagUids(cardTagUids.filter((tagUid)=>{return !(removeTagUid==tagUid)}))
  }

  return (
    <IonItem>
      {
        cardTagUids.map((tagUid)=>{
          const tag = tags.filter((tag)=>tag.uid as string == tagUid)[0];
          return (
            <IonChip onClick={()=>onRemoveTag(tag.uid as string)}>{tag.TagName}</IonChip>
          )
        })
        
      }

      <input type='text' value={newTagName} onChange={e=>setNewTagName(e.currentTarget.value as string)} list="tags"/>
      <IonButton onClick={onAddTag}>add new Tag</IonButton>
      <datalist id='tags'>
        {
          tags.map((tag)=>{
            return (<option key={nanoid()} value={tag.TagName} />)
          })
        }
      </datalist>
      
    </IonItem>
  );
};

