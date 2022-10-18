import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LoggedIn() {
    const location = useLocation();
    const navigate = useNavigate();
    // hämta alla bilder som användaren tagit
    const [images, setImages] = useState();
    const user = location.state.user;
    // om du är en admin, då ska vi hämta alla bilder som alla tagit
    
    async function getAllImages() {
        console.log(`Välkommen tillbaks, ${location.state.user}.`);
        if(user !== null) {
          const userObj = {
            username: user
          };
          // kalla på vårt api för att få alla bilder länkade till användaren
          const response = await fetch("http://localhost:5000/getimages", {
            method: "POST",
            body: JSON.stringify(userObj),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log(data);
          setImages(await data);
          console.log(images);
        } else {
            console.log('No user set')
        }
    } 
    
    async function deletePhoto(_id) {
      console.log("Delete called");
        const response = await fetch("http://localhost:5000/deletephoto", {
            method: 'DELETE',
            body: JSON.stringify({ 
                username: location.state.user,
                _id: _id, 
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(resp => resp.json()).then(data => console.log(data));

      getAllImages();
    }
    useEffect(() => {
        if (!images) {
            getAllImages();
        }
        console.log(images);
    }, [images]);

    return (
        <>
        <h1 className="image-gallery">Bildgalleri</h1>
        <img className="camera-lens" onClick={()=>navigate("/media", {state: {user: location.state.user}})} src="images/camera-lens-2.png" alt='Camera lens'/>
        
        <section className="container">
                <div className="row">
                    {Array.isArray(images) && images.length > 0 ? 
                        images.map((image, index) => {
                            return (
                                <div key={index} className="card-image" style={{ backgroundImage: `url(${image.img})` }}>
                                <span 
                                className="btn" 
                                onClick={() => {
                                    deletePhoto(image._id)
                                }
                            }>&times;</span>
                            </div>
                            );
                        })
                        : null}
        </div>
        </section>        
    </>
    )
}

export default LoggedIn;
