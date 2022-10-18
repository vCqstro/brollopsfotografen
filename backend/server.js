const express = require('express');
const cors = require('cors');
const neDB = require('nedb-promise');
const bcrypt = require('bcryptjs');

const app = express();

const accounts = new neDB({
    filename: 'accounts.db',
    autoload: true
})

const images = new neDB({
    filename: 'images.db',
    autoload: true
})

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.get('/', (request, response) => {
    response.send("Bröllopsappen!");
});

app.post('/signup', async (request, response) => {
    //Sparar credentials från request
    const credentials = request.body;

    //Skapa ett objekt som sedan kommer skickas till användaren
    //För att meddela hur det gick
    const resObj = {
        success: true,
        usernameExists: false,
        emailExists: false
    }

    // Tittar om något konto har sammma username och email som något i databasen redan
    const userExists = await accounts.findOne({
        username: credentials.username,
        email: credentials.email
    })

    //Kolla om det fanns en användare redan
    if (userExists) {
        console.log("Ditt konto kunde inte skapas!")
        resObj.success = false;
    } else {
        //Skapa ett objekt med nyklarna username, email, password, admin
        const newUserObject = {
            username: credentials.username,
            email: credentials.email,
            password: credentials.password,
            admin: false
        }

        //Lägger till den nya användaren i databasen
        await accounts.insert(newUserObject);
    }

    //Svara användaren med hur det gick
    response.json(resObj);
})

app.post('/login', async (request, response) => {
    const credentials = request.body;
    const resObj = {
        success: false
    }
    console.log(credentials);
    const account = await accounts.find({
        username: credentials.username,
    })
    const usernameExists = await accounts.findOne({
        username: credentials.username
    })

    password: credentials.password
    const passwordExists = await accounts.findOne({})

    console.log(`Du har nu loggat in, välkommen ${credentials.username}.`);
    if (usernameExists !== null && passwordExists !== null) {
        resObj.success = true
    } else {
        console.log("Kan inte hitta användare!");
    }
    response.json(resObj)
});

app.post('/getimages', async (request, response) => {
    let imgs;
    // ta in bilderna som hör till användaren som är inloggad
    const userId = request.body.username;

    //Hitta och spara användaren
    const user = await accounts.findOne({
        username: userId
    });

    //Om användaren är admin, hämta alla bilder
    if (user.admin) {
        imgs = await images.find({})
    } else {
        //Annars hämta bara användarens
        imgs = await images.find({
            userId
        });
    }

    if (imgs.length === 0) {
        return response.json({
            message: "No images found on user"
        })
    }

    if (imgs.length > 0) {
        return response.json(imgs);
    }
});

app.post('/postimages', async (request, response) => {
    if (!request.body.username || !request.body.img) {
        return response.json({
            message: "Missing information"
        })
    }
    let imgToAdd = {
        userId: request.body.username,
        img: request.body.img,
        //Räcker så för att den kommer skapa _id automatiskt | Alright, låter ju bra. Tusen tack!
    }
    await images.insert(imgToAdd);

    response.json({
        message: "Image added success"
    })
});

app.delete('/deletephoto', async (request, response) => {
    let {
        _id
    } = request.body;

    await images.remove({
        _id
    });

    response.json(request.body)
})


const port = 5000;
app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
})