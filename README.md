# nodejwt
This sample project demonstrate the use of JWT with Node and MySQL
It creates two POST endpoints.
1.http://localhost:3000/authenticate
  Input paramenter:
    userName
    password
 Http Header:
    Content-Type : application/x-www-form-urlencoded
 Response:
    a json with toekn
2. http://localhost:3000/api/employee This will add a new employee if authenticated or return error.
   Input Parameter:
    json: {
	"employee_id": "test",
              "role_id": 1,
              "first_name": "String",
              "last_name" : "String",
              "designation":"SWD",
              "date_of_joining": "2012-04-23",
              "password":"password",
              "email":"test1@test.com",
              "supervisor_id":0
    }  
    Headers:
        x-access-token: <Token String received from 1st call>  
        Content-Type: application/json        