/* eslint-disable require-jsdoc */
import { DocumentReference } from 'firebase/firestore';

export const getPath = (docRef : DocumentReference) =>{
  function tuple<T extends any[]>(...elements: T) {
    return elements;
  }

  const arrayPath = (docRef as any)._path.segments;
  const newArray = (Array.from(arrayPath) as Array<string>).slice(5);

  const paths = tuple(...newArray);
  return paths;
};

export { };

