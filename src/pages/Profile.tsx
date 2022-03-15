
import { IonPage, IonHeader, IonContent, IonLabel, IonRouterOutlet, IonTabs, IonTitle, IonToolbar, IonTabBar, IonTabButton, useIonLoading, IonButton, IonButtons, IonItem, IonInput, IonImg, IonIcon } from '@ionic/react';
import { Redirect, Route } from 'react-router';
import SettingsContainer from '../components/profile/SettingsContainer';
import PostsContainer from '../components/profile/PostsContainer';

import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getUserRef } from "../firebase-config";
import { get, update } from "@firebase/database";
import { camera } from "ionicons/icons";
import { Camera, CameraResultType } from "@capacitor/camera";
import { uploadString, ref, getDownloadURL } from "@firebase/storage";
import { storage } from "../firebase-config";
import { Toast } from "@capacitor/toast";
import './Profile.css';
import ProfileInfo from '../components/profile/ProfileInfo';


export default function Profile() {
	const auth = getAuth();
	// I am scared to use type any here -> It could be null, we need to do some better error handling here.
	const [user, setUser] = useState<any>({});
	const [name, setName] = useState("");
	const [title, setTitle] = useState("");
	const [image, setImage] = useState("");
	const [imageFile, setImageFile] = useState<any>({});
	const [showLoader, dismissLoader] = useIonLoading();

	useEffect(() => {
		setUser(auth.currentUser);

		async function getUserDataFromDB() {
			const snapshot = await get(getUserRef(user.uid));
			const userData = snapshot.val();
			if (userData) {
				setName(userData.name);
				setTitle(userData.title);
				setImage(userData.image);
			}
		}
		if (user) getUserDataFromDB();
	}, [auth.currentUser, user]);

	function handleSignOut() {
		signOut(auth);
	}

	async function handleSubmit(event: any) {
		event.preventDefault();
		showLoader();

		const userToUpdate = {
			name: name,
			title: title,
			image: image
		};

		if (imageFile.dataUrl) {
			const imageUrl = await uploadImage();
			userToUpdate.image = imageUrl;
		}

		await update(getUserRef(user.uid), userToUpdate);
		dismissLoader();
		await Toast.show({
			text: "User Profile saved!",
			position: "top"
		});
	}

	async function takePicture() {
		const imageOptions = {
			quality: 80,
			width: 500,
			allowEditing: true,
			resultType: CameraResultType.DataUrl
		};
		const image = await Camera.getPhoto(imageOptions);
		image.dataUrl = "";
		setImageFile(image);
		setImage(image.dataUrl);
	}

	async function uploadImage() {
		const newImageRef = ref(storage, `${user.uid}.${imageFile.format}`);
		await uploadString(newImageRef, imageFile.dataUrl, "data_url");
		const url = await getDownloadURL(newImageRef);
		return url;
	}
	// --------- Handle OnChangeEvents ------------- //
	function handleSetName(event: any) {
		setName(event.currentTarget.value);
	}

	function handleSetTitle(event: any) {
		setTitle(event.currentTarget.value);
	}

	return (
				<IonTabs>
				<IonTabBar slot='bottom'>
					<IonTabButton tab='posts' href='/profile/'>
						<IonLabel>Posts</IonLabel>
					</IonTabButton>
					<IonTabButton tab='settings' href='/profile/settings'>
						<IonLabel>Settings</IonLabel>
					</IonTabButton>
				</IonTabBar>
	
				<IonRouterOutlet>
					<Route path='/profile/settings' component={SettingsContainer} exact />
					<Route path='/profile/' component={PostsContainer} exact />
				</IonRouterOutlet>
			</IonTabs>
	);
};


