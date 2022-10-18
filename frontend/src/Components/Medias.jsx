import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
    const location = useLocation();
    const videoRef = useRef(null);
    const photoRef = useRef(null);

    const navigate = useNavigate();

    const [hasPhoto, setHasPhoto]= useState(false);
    const [user, setUser] = useState(location.state.user);

    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: 1920,
                    height: 1080
                }
            })
            .then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error(err);
            })
    }

    const takePhoto = () => {
        const width = 50;
        const height = 50;

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = photo.toDataURL('image/png');
        console.log(imageData);
        sendImgToDb(imageData);
        setHasPhoto(true);
    }

    const sendImgToDb = async (img) => {
        console.log(user);
        //koll om user är satt
        const data = {
            username: user,
            img: img
        };
        const response = await fetch('http://127.0.0.1:5000/postimages', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resData = await response.json();
        console.log(resData);
    }

    const closePhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');

        ctx.clearRect(0, 0, photo.width, photo.height);

        setHasPhoto(false);
    }

    console.log(photoRef);

    useEffect(() => {
        getVideo();
    }, [videoRef])

    return (
        <>
            <div className="application">
                <img className="grid-icon" onClick={()=>navigate("/loggedin", {state: {user: location.state.user}})} src="images/grid-icon.svg" alt='Camera lens' />
                <div className="camera">
                    <video ref={videoRef}></video>
                    <button className='phototaker' onClick=
                        {takePhoto}>TA BILD!</button>
                </div>
                <div className={'result ' +
                    (hasPhoto ? 'hasPhoto'
                        : '')}>
                    <h3 className="nice-picture">Vilken fin bild du tog!</h3>
                    <canvas ref={photoRef}></canvas>
                    <button className='close-photo' onClick={closePhoto}>STÄNG!</button>
                </div>
            </div>
        </>
    );
}

export default App;