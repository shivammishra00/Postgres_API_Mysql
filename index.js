let { Sequelize, DataTypes } = require("sequelize"); ///object cunstructor hai
                                           ////   isme DataType use karna padta hai ...
let express = require("express"); //
let app = express();
app.use(express.json());
// console.log(Sequelize)

let sequelize = new Sequelize("sequelize", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

//// connection chek ke liye authenticate method hoti hai ki connection hua ya nhi
// authntication is a promise base method

sequelize
    .authenticate()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Not Connected", err);
    });

//////////////////////  Creating a table using sequelize  ///////////////////
// object map hoga relation se
//// model kahte hai model ka definition ho gaya

const empl = sequelize.define("empl", {
    empid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    empname: {
        type: DataTypes.STRING(20),
        allowNull: "no",
    },
    city: {
        type: DataTypes.STRING(20),
    },
    salary: DataTypes.INTEGER(6),
});

/////////// sync method use hoti hai table create hui ya nhi for chek  ///////////
// objectname.sync

empl
  .sync()
  .then(() => {
    console.log("Table is crated");
  })
  .catch((err) => {
    console.log("Table not created...", err);
  });

////////////// get method  /////////
app.get("/user", async (req, res) => {
    try {
        let result = await empl.findAll(); ////
        res.send(result);
    } catch (err) {
        res.send("Error", err);
    }
});


/////////////  post ///////////
app.post("/savedata", (req, res) => {
    let { empid, empname, city, salary } = req.body;   ///  body se ye data send karge .
    empl.create({ empid, empname, city, salary })  /// this is query  
        .then((result) => res.json(result))
        .catch((err) => res.send(err))
    // console.log(req.body)
})


////////////////////  delete  api  //////////////////////
app.delete('/deleteuser/:empid', async (req, res) => {
    const empid = req.params.empid;
    try {
        const deleteEmp = await empl.destroy({
            where: { empid }
        });
        res.send({ Message: "data deleted successfully", deleteEmp });
    } catch (error) {
        res.status(500).send({ Error: "data not found" });
    }
});
////////////////////////////////  Put api  ///////////////
app.put('/updateuser/:empid', async (req, res) => {
    const empid = req.params.empid;
    const { empname, city, salary } = req.body;
    try {
        const updatedEmp = await empl.update({ empname, city, salary }, {
            where: { empid }
        });
        res.send({ Message: "Data updated succesfully", updatedEmp });
    } catch (error) {
        res.status(500).send("Error: " + error);
    }
});

///////////server up //
app.listen(5001, () => {
    console.log("server is running on port 5001");
});
