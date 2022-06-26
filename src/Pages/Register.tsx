import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRippleEffect, IonText } from '@ionic/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuth, useFirestore, useSigninCheck } from 'reactfire';
import { Tables, TypeUser, enumNotifFreq } from '../Model/model';

const _Register = (props:any) => {
  const firestore = useFirestore();
  const auth = useAuth();
  const {status, data: useSigninCheckResult} = useSigninCheck();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState<string>('');

  const onNameChange = (e:any) => {
    setName(e.currentTarget.value);
  };
  const onEmailChange = (e:any) => {
    setEmail(e.currentTarget.value);
  };
  const onPasswordChange = (e:any) => {
    setpassword(e.currentTarget.value);
  };

  const onSubmitHandle = async ()=> {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(firestore, Tables.Users), {
        userUid: auth.currentUser?.uid as string,
        userName: name,
        userEmail: email,
        userNotifFreq: enumNotifFreq.Instant,
        userInvitation: [],
        userNotifications: [],
        userBio: '',
      } as TypeUser);
      props.history.push('/home');
    } catch (exception) {
      alert(exception);
    }
  };

  if (status=='loading') {
    return (
      <div>accessing data...</div>
    );
  }

  if (useSigninCheckResult.signedIn === true) {
    return (
      <Redirect to="/" />
    );
  }


  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Register Page</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <form>
              <IonItem>
                <IonLabel position='fixed'>Name</IonLabel>
                <IonInput
                  type='text'
                  value={name}
                  onIonChange={(e)=>{
                    onNameChange(e);
                  }}
                  placeholder="name"
                />
              </IonItem>
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
              <h6 className='ion-text-center'>Already have an account?</h6>
              <Link to='/login' className='ion-align-self-center'>
                <IonButton >
                  login
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

const Register = withRouter(_Register);

export { Register };

