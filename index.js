const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const port = 5001

let users = [];
app.use(express.json());

app.post('/register' ,async (req,res)=> {
  try{
    const {email,password} = req.body
    const findUser = users.find((data) => email === data.email)
    if (findUser) {
      res.status(400).send({message:'email and password cannot be used'});
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    users.push({ email, password: hashedPassword });
    res.status(201).send({status:"success",message:'Registered successfully'})
  }catch(err) {
    res.status(500).send({message: err.message})
  }
})

app.post('/login', async (req, res) => {
  try {
     const { email, password } = req.body;
    const findUser = users.find((data) => email === data.email);
    if (!findUser) {
      res.status(400).send({ message: "wrong email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, findUser.password)
    if (passwordMatch) {
          res
            .status(200)
            .send({ status: "success", message: "logged in successfully" });
    } else {
      res
        .status(400)
        .send({ status: "fail", message: "wrong email or password" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
})

app.listen(port, () => {
  console.log('listening...');
})