import React from 'react';
import { useGlobalContext } from '../../context/ContextProvider';

const Profile = () => {
  const globalContext = useGlobalContext();
  const user = globalContext.user;

  return (
    <div>
      profile {user.userName}
    </div>
  );
};

export { Profile };

