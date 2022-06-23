import { doc, serverTimestamp } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router';
import { useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeWorkspace, WorkspaceVisibility } from '../../Model/model';

type TypeWorkspaceContext = {
  workspace : TypeWorkspace,
}

let workspaceContext = createContext<TypeWorkspaceContext>({
  workspace: {
    workspaceName: '',
    workspaceDescription: '',
    workspaceMembers: [],
    workspaceVisibility: WorkspaceVisibility.Workspace,
    workspaceCreatedDate: serverTimestamp(),
  },
});

export const useWorkspaceContext = ()=>{
  return useContext(workspaceContext);
};


type props = {
  children : React.ReactNode | React.ReactNode[]
}

export const WorkspaceContext : React.FC<props> = ({children}) => {
  const globalContext = useGlobalContext();
  const firestore = globalContext.firestore;

  const {workspaceUid} = useParams() as {workspaceUid : string};

  const refWorkspace = doc(firestore, Tables.Workspaces, workspaceUid);
  const {status: statusWorkspace, data: resWorkspace} = useFirestoreDocData(refWorkspace, {
    idField: 'uid',
  });


  if (statusWorkspace === 'loading') {
    return <div>checking authorization...</div>;
  }

  if (!resWorkspace) {
    return <div>inalid url or you do not have access</div>;
  }

  const workspace = resWorkspace as TypeWorkspace;
  workspaceContext = createContext<TypeWorkspaceContext>({workspace});

  return (
    <>
      {children}
    </>
  );
};
