import React from 'react';
import { Route } from 'react-router';
import { BoardAll } from '../Components/Board/BoardAll';
import { BoardDetail } from '../Components/Board/BoardDetail/BoardDetail';

const Board = () => {
  return (
    <div>
      this is board
      <Route path='/workspace/:workspaceUid/board' component={BoardAll} exact={true}/>
      <Route path='/workspace/:workspaceUid/board/:boardId' component={BoardDetail} exact={true}/>
    </div>
  );
};

export { Board };

