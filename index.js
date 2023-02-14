const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// midddleware
app.use(cors())
app.use(express.json())

// username : gblusers, password: PlZSg836FOMJgzkq
const uri = `mongodb+srv://gblusers:PlZSg836FOMJgzkq@cluster0.v2wwlww.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// async await
async function run() {
    try {
        const jobCategoriesCollections = client.db('careersBangladeshDB').collection('jobCategories');
        const jobCollections = client.db('careersBangladeshDB').collection('jobs');

        const userCollections = client.db('careersBangladeshDB').collection('users');
        const employerCollections = client.db('careersBangladeshDB').collection('employer');
        const jobseekerCollections = client.db('careersBangladeshDB').collection('jobseeker');
        const applicationCollections = client.db('careersBangladeshDB').collection('applications');



        //////////////////////////// job Category Query Section Start//////////////////////////////////////////////

        // query to save a Job Category
        app.post('/jobCategories', async (req, res) => {
            const category = req.body;
            const result = await jobCategoriesCollections.insertOne(category);
            res.send(result);
        });


        // query to show Job Categories
        app.get('/jobCategories', async (req, res) => {
            const query = {};
            const cursor = jobCategoriesCollections.find(query);
            const category = await cursor.toArray();
            res.send(category);
        });





        // // query to delete a JobCategory
        // app.delete('/jobCategories/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await jobCategoriesCollections.deleteOne(query);
        //     res.send(result);
        //     // console.log('trying to delete', id);
        // });

        //////////////////////////// job Category Query Section End//////////////////////////////////////////////





        //////////////////////////// job Post Query Section Start//////////////////////////////////////////////
        // query to save a Job
        app.post('/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobCollections.insertOne(job);
            res.send(result);
        });


        // query to show Job 
        app.get('/jobs', async (req, res) => {
            const query = {};
            const cursor = jobCollections.find(query);
            const job = await cursor.toArray();
            res.send(job);
        });

        // show a job by id
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const job = await jobCollections.findOne(query);
            res.send(job);
        })


        // app.get('/categoryJobs', async (req, res) => {
        //     let query = {};
        //     if (req.query.category) {
        //         query = {
        //             category: req.query.category
        //         }
        //     }
        //     const cursor = jobCollections.find(query).sort({ postDate: -1 });
        //     const jobs = await cursor.toArray();
        //     res.send(jobs);
        // })


        app.get('/categoryJobs', async (req, res) => {
            const category = req.query.category;

            const query = { category: category };
            const jobs = await jobCollections.find(query).toArray();
            res.send(jobs);
        })




        // // query to delete a Job
        // app.delete('/jobs/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await jobCollections.deleteOne(query);
        //     res.send(result);
        //     // console.log('trying to delete', id);
        // });

        //////////////////////////// job Post Query Section End//////////////////////////////////////////////




        //////////////////////////// job Application Query Section Start //////////////////////////////////////////////  


        // save application on database
        app.post('/applications', async (req, res) => {
            const application = req.body;
            result = await applicationCollections.insertOne(application);
            res.send(result);
        })


        // query to show all application
        app.get('/applications', async (req, res) => {
            const query = {};
            const cursor = applicationCollections.find(query)
            const result = await cursor.toArray();
            res.send(result);
        })


        // show all application by job seeker email
        app.get('/jobseekerapply', async (req, res) => {

            // const decoded = req.decoded;
            // // console.log('inside orders api : ', decoded);
            // if (decoded.email !== req.query.email) {
            //     res.status(403).send({ message: 'Forbidden Access' })
            // }

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = applicationCollections.find(query).sort({ applicationDate: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })


        // // show all application by service
        // app.get('/application', async (req, res) => {
        //     let query = {};
        //     if (req.query.service) {
        //         query = {
        //             service: req.query.service
        //         }
        //     }
        //     const cursor = applicationCollections.find(query).sort({ reviewPostDate: -1 });
        //     const application = await cursor.toArray();
        //     res.send(application);
        // })
        //////////////////////////// job Application Query Section End //////////////////////////////////////////////





        //////////////////////////// user query Section start //////////////////////////////////////////////

        // query to show all users
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollections.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });


        // query to save a new user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            res.send(result);
        });



        // // query to show a user by id
        // app.get('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const user = await userCollections.findOne(query);

        //     res.send(user);
        // })


        // query to add a user as admin
        app.put('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    role: "admin"
                }
            }
            const result = await userCollections.updateOne(filter, updatedDoc, options)
            res.send(result)
        })


        // query to find admin user by email
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })


        // query to find a employer user by email
        app.get('/users/employer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ isEmployer: user?.userType === "employer" });
        })


        // query to find jobseeker user by email
        app.get('/users/jobseeker/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ isJobSeeker: user?.userType === "jobseeker" });
        })


        // query to update a user
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const user = req.body;
            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email,
                }
            }
            const result = await userCollections.updateOne(filter, updatedUser, options)
            res.send(result);
        })


        // query to delete a user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollections.deleteOne(query);
            res.send(result);
            // console.log('trying to delete', id);
        });

        //////////////////////////// user query Section end //////////////////////////////////////////////






        //////////////////////////// Employ Query Section Start //////////////////////////////////////////////

        // query to save a employee Profile
        app.post('/emplyerProfile', async (req, res) => {
            const employer = req.body;
            const result = await employerCollections.insertOne(employer);
            res.send(result);
        });




        // query to show a employee by emailid
        app.get('/employer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const employer = await employerCollections.findOne(query);
            res.send(employer);
        })

        //////////////////////////// Employ Query Section End //////////////////////////////////////////////





        //////////////////////////// Job Seeker Query Section Start //////////////////////////////////////////////     

        // query to save a jobseeker Profile
        app.post('/jobseekerProfile', async (req, res) => {
            const jobseeker = req.body;
            const result = await jobseekerCollections.insertOne(jobseeker);
            res.send(result);
        });

        // query to show a jobseeker by emailid
        app.get('/jobseeker/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const jobseeker = await jobseekerCollections.findOne(query);
            res.send(jobseeker);
        })
        //////////////////////////// Job Seeker Query Section End //////////////////////////////////////////////


    }
    catch {
        (error) => console.log(error)
    }
    finally {

    }
}
run().catch(err => console.log(err));











app.get('/', (req, res) => [
    res.send('The Careers Bangladesh Server is Running.')
])

app.listen(port, () => [
    console.log(`Listen to port ${port}`)
])