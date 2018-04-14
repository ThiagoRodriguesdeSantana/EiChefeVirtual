import { Image } from './../../models/image';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Login } from '../../models/login';
import { Router, UrlSegment, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CommonService {


   
    basePath = 'imagens';
    urlImage: string;
    private email = new BehaviorSubject<string>('');
    email$ = this.email.asObservable();

    constructor(private firebaseDb: AngularFireDatabase,
        private route: Router) {
        this.onAlterStatusUser();
    }


    login(login: Login) {
        if (login.email == null || login.password == null) {
            alert('E-mail ou senha não informado!')
        } else {
            let auth = firebase.auth();
            const promise = auth
                .signInWithEmailAndPassword(login.email, login.password);
            promise.then(result => {
                this.route.navigate(['home']);
            })
            promise.catch(e => {
                alert(e.message);
            });
        }
    }
    onAlterStatusUser() {
        firebase.auth().onAuthStateChanged(user => {
            var url = this.route.routerState.snapshot.url;
            if (user) {
                console.log(user)
                this.email.next(user.email);
                if (url == '/') {
                    this.redirectToHomePage();
                }
            } else if (url != '/cadastro-empresa') {
                this.redirectToLoginPage();
            }
        });
    }
    addNewUser(login: Login) {
        let email = login.email;
        let senha = login.password;
        //TODO: Validar se email existente
        if (email != null || senha != null) {
            let auth = firebase.auth();
            const promise = auth
                .createUserWithEmailAndPassword(email, senha);
            promise.then(t => {
                this.route.navigate(['home']);
            })
            promise.catch(e => alert(e.message));
        }
    }

    redirectToHomePage() {
        this.route.navigate(['home']);
    }
    redirectToLoginPage() {
        this.route.navigate(['']);
    }

    logaout() {
        firebase.auth().signOut();

    }

    saveImage(imagemUpload: Image, progress: { percentage: number }) {

        return new Promise((res, reject) => {
            const storageRef = firebase.storage().ref();
            const uploadTask = storageRef.child(`${this.basePath}/${imagemUpload.file.name}`).put(imagemUpload.file);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    const snap = snapshot as firebase.storage.UploadTaskSnapshot;
                    progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    res(uploadTask.snapshot.downloadURL)
                }
            );
        });
    }

}
