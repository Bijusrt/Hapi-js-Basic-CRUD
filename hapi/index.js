const hapi = require('hapi');

const fs = require('fs');

const promise = require('promise');

const server = new hapi.Server({

    host : 'localhost',

    port : 8080

})

let file = JSON.parse(fs.readFileSync('sample.json'));

server.route({

    method : 'GET',

    path : '/get/{username}',

    handler : async(req)=>{

        var flag = true;

        for (var i of file){

            if(i.username == req.params.username){

                flag = false;

                return i;

            }

        }

        if (flag){

            return 'No Such User';
            
        }

    }

});

server.route({
    
    method : 'POST',

    path : "/signup",

    handler : async(req)=>{

        let id = file[file.length-1].id + 1;

        req.payload.id = id;

        file.push(req.payload);

        let writer = await fs.writeFileSync('sample.json',JSON.stringify(file,null,4));

        return file;

    }

});

server.route({

    method : ['PUT','PATCH'],

    path : "/changepassword/{username}",

    handler : async(req)=>{

        let flag = true;

        for (var i of file){

            if(i.username == req.params.username){

                flag = false;

                i.password = req.payload.newpassword;

                let writer = await fs.writeFileSync('sample.json',JSON.stringify(file,null,4));

                return 'Passwrod Changed Successfully!';

            }

        }

        if(flag){

            return 'No Such User';

        }

    }

});

server.route({

    method : 'DELETE',

    path : "/delete/{id}",

    handler : async(req)=>{

        file.splice(req.params.id-1,1);

        for (var i = req.params.id-1;i <= file.length-1;i++){

            if(file[i].id != file[i-1].id+1){

                file[i].id = file[i-1].id+1;

            }
            
        }

        let writer = await fs.writeFileSync('sample.json',JSON.stringify(file,null,4));

        return file;

    }

})

server.start((err)=>{

    if (err){

        console.log(err);
        
    }
});

console.log(`server started  at : ${server.info.uri}`);

    
