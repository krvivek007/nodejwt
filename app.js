var express = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var jwt    = require('jsonwebtoken'); 
var orm = require("orm");
var app = express();

app.set('superSecret', "mysecret");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(orm.express("mysql://root:password@<DB URL>/<DB Name>", {
    define: function (db, models) {
        models.employee = db.define("employee", {
              employee_id: {type: 'text', key: true},
              role_id: Number,
              first_name: String,
              last_name : String,
              designation:String,
              date_of_joining: Date,
              password:String,
              email:String,
              supervisor_id:Number,
        });
        models.role =db.define("role", {
          employee_id: {type: 'serial',key: true},
          role_name: Number,
          role_description: String
          });
        models.employee.hasOne({field:'role_id'}, models.role);
    }
}));


app.post('/authenticate', function(req, res) {
  var userName = req.body.userName;
  var password = req.body.password;
  //console.log(password);
  req.models.employee.find({ employee_id: req.body.userName }, function (err, employee) {
      if (err) throw err;
      const payload = {
        employee_id: employee[0].employee_id,
        role_id:employee[0].role_id,
        email:employee[0].email
      };
      var token = jwt.sign(payload, app.get('superSecret'), {	});
      if(employee[0].password == password){
        res.json({
              success: true,
              token: token
            });
         }else{
           res.json({
              success: false,
              message: 'Invalid!'
            });
         }
  });
});

function checkAuthticaton(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
     jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        req.decoded = decoded; 
        next();
      }
    });
  } else {
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
}

app.post('/api/employee', checkAuthticaton, function(req, res, next) {
  //Super User
	if(req.decoded.role_id == 1){
      req.models.employee.create(req.body, function(err) {
        if (err) throw err;
        res.status(200).send({
          success: false,
          message: 'Employee Created' 
        });
    });
  }else{
    console.log("%s does not have permission to create employee", req.decoded.employee_id);
  }
});	

// Routes
app.get('/', function(req, res) {
	con.connect(function(err) {
  if (err) throw err;
  req.models.employee.find({ employee_id: "0" }, function (err, employee) {
    if (err) throw err;
      console.log("employee found: %d", employee.length);
      console.log("first employee: %s, password %s", employee[0].employee_id, employee[0].password);
      res.json(employee[0]);
    });
  });
});

// Listen
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on localhost:'+ port);