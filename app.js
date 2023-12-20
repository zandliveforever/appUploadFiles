import { initializeApp } from "firebase/app"
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {upload} from './upload.js'

const firebaseConfig = {
  apiKey: "AIzaSyBP8UXl82o52HE_SBSEFGn2TyuayqlIcxk",
  authDomain: "fe-upload-a.firebaseapp.com",
  projectId: "fe-upload-a",
  storageBucket: "fe-upload-a.appspot.com",
  messagingSenderId: "313549941030",
  appId: "1:313549941030:web:f12b43c36cc4250cc639e7"
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app);

upload('#file', {
  multi:'true',
  accept: ['.png', '.jpg', '.jpeg', '.img', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, 'images/' + file.name)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed',
  (snapshot) => {
    const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
    console.log('Upload is ' + progress + '% done')
    const block = blocks[index].querySelector('.preview-info-progress')
    block.textContent = progress
    block.style.width = progress + '%'
    switch (snapshot.state) {
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    switch (error.code) {
      case 'storage/unauthorized':
        break;
      case 'storage/canceled':
        break;

      case 'storage/unknown':
        break;
    }
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    })
  })
})
}
})
