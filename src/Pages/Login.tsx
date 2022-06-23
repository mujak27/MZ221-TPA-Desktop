import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRippleEffect,
  IonText,
} from '@ionic/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { useSigninCheck } from 'reactfire';
import { useGlobalContext } from '../context/ContextProvider';

const Login = () => {
  const globalContext = useGlobalContext();
  const auth = globalContext.auth;
  const {status, data: useSigninCheckResult} = useSigninCheck();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailChange = (e:any) => {
    setEmail(e.currentTarget.value);
  };
  const onPasswordChange = (e:any) => {
    setPassword(e.currentTarget.value);
  };


  const onSubmitHandle = async ()=> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (exception) {
      console.log(exception);
    }
  };

  if (status=='loading') {
    return (
      <div>accessing data...</div>
    );
  }

  if (useSigninCheckResult.signedIn === true) {
    return (
      <Redirect to="/home" />
    );
  }

  return (
    <IonPage>
      <IonHeader>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Login Page</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <form>
              <IonItem>
                <IonLabel position='fixed'>Email</IonLabel>
                <IonInput
                  type='text'
                  value={email}
                  onIonChange={(e)=>{
                    onEmailChange(e);
                  }}
                  placeholder="email"
                />
              </IonItem>
              <IonItem>
                <IonLabel position='fixed'>Password</IonLabel>
                <IonInput
                  type='password'
                  value={password}
                  onIonChange={(e)=>{
                    onPasswordChange(e);
                  }}
                  placeholder="password"
                />
              </IonItem>
              <IonItem>
                <IonButton onClick={onSubmitHandle}>
                Submit
                </IonButton>
              </IonItem>
            </form>
            <IonText className='flex'>
              <h6
                className='ion-text-center primary-button'
              >Dont have an account?</h6>
              <Link to='/register' className='ion-align-self-center'>
                <IonButton >
                  register
                  <IonRippleEffect></IonRippleEffect>
                </IonButton>
              </Link>
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export { Login };

