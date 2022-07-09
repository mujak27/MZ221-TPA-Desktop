import { IonButton, IonChip, IonInput, IonTitle } from '@ionic/react';
import { addDoc, collection } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../context/ContextProvider';
import { Tables, TypeTag } from '../../../Model/model';
import '../../style.css';
import { useBoardContext } from '../BoardContext';

type props = {
}

export const BoardTags : React.FC<props> = ({}) => {
  const {firestore, setRefresh, } = useGlobalContext();
  const {board} = useBoardContext();
  const {tags, selectedTags, setSelectedTags} = useBoardContext();

  const [searchTagTitle, setSearchTagTitle] = useState('');
  const [newTagTitle, setNewTagTitle] = useState('');

  const onNewTag = async ()=>{
    const refTag = collection(firestore, Tables.Boards, board.uid as string, Tables.Tags);
    await addDoc(refTag, {
      TagName: newTagTitle
    } as TypeTag)
    alert('new tag added');
    setRefresh(true);
  }

  const onAddTag = ()=>{
    const newSelectedTag = tags.filter(tag=>{return tag.TagName == searchTagTitle})[0];
    if(!newSelectedTag) return;
    setSelectedTags([
      ...selectedTags,
      newSelectedTag,
    ])
    // setRefresh(true);
  }

  const onRemoveTag = (tagName : string)=>{
    setSelectedTags(selectedTags.filter((selectedTag)=>{return !selectedTag.TagName.includes(tagName)}));
  }

  return (
    <>
        <>
          <IonTitle>Add Tags :</IonTitle>
          {
            selectedTags.map((tag)=>{
              return <IonChip key={nanoid()} onClick={()=>onRemoveTag(tag.TagName)} color='secondary'>{tag.TagName}</IonChip>
            })
          }

          <input type='text' value={searchTagTitle} onChange={e=>setSearchTagTitle(e.currentTarget.value as string)} list="tags"/>
          <IonButton onClick={onAddTag}>add new Tag</IonButton>
          <datalist id='tags'>
            {
              tags.map((tag)=>{
                return (<option key={nanoid()} value={tag.TagName} />)
              })
            }
          </datalist>

          <IonInput type='text' value={newTagTitle} onIonChange={e=>setNewTagTitle(e.detail.value as string)} />
          <IonButton onClick={onNewTag}>add new Tag</IonButton>
        </>
    </>
  );
};
