import mongoose from 'mongoose'

const Mongodb_uri =process.env.MONGODB_URI!

if(!Mongodb_uri)
{
    throw new Error("Check your db connection string")
}
let cached = global.mongoose;

if(!cached){
    cached = global.mongoose ={con :null ,promise:null}
}

export async function name() {
    if(cached.con){
        return cached.con
    }
    if(!cached.promise){
        const opts = {
            butfferCommands:true,
            maxPoolSize:10
        };
        cached.promise = mongoose.connect(Mongodb_uri,opts).then(()=>mongoose.connection);
    }

    try{
        cached.con = await cached.promise;
    }
    catch(error)
    {
        cached.promise = null;
    }
    return cached.con
}