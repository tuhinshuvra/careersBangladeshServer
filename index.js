const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// midddle wares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v2wwlww.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(process.env.DB_USER, process.env.DB_PASSWORD)


// async await
async function run() {
    try {
        const jobCategoriesCollections = client.db('careersBangladeshDB').collection('jobCategories');
        const jobCollections = client.db('careersBangladeshDB').collection('jobs');

        const userCollections = client.db('careersBangladeshDB').collection('users');
        const employerCollections = client.db('careersBangladeshDB').collection('employer');
        const jobseekerCollections = client.db('careersBangladeshDB').collection('jobseeker');
        const applicationCollections = client.db('careersBangladeshDB').collection('applications');
        const savedJobCollections = client.db('careersBangladeshDB').collection('savedJobs');



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
            const cursor = jobCollections.find(query).sort({ postDate: -1 });
            const job = await cursor.toArray();
            res.send(job);
        });

        // query to show Job 
        app.get('/jobSearch', async (req, res) => {
            const search = req.query.search;
            console.log("search data : ", search)

            let query = {}
            if (search.length) {
                query = {
                    $text: {
                        $search: search
                    }
                };
            }

            const cursor = jobCollections.find(query).sort({ postDate: -1 });
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


        // show all applicant on a job
        app.get('/applicantList', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const job = await jobCollections.findOne(query);
            res.send(job);
        })


        // show all saved job by job category
        app.get('/jobbycategory', async (req, res) => {

            let query = {};
            if (req.query.category) {
                query = {
                    category: req.query.category
                }
            }
            // console.log("Category id : ", query)
            const cursor = jobCollections.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // search job by jobTitle saved job by job category
        app.get('/jobByTitle', async (req, res) => {

            let query = {};
            if (req.query.jobTitle) {
                query = {
                    jobTitle: req.query.jobTitle
                }
            }
            // console.log("Category id : ", query)
            const cursor = jobCollections.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/jobapplicant', async (req, res) => {
            let query = {};
            if (req.query.jobId) {
                query = {
                    jobId: req.query.jobId
                }
            }

            // console.log("query jobId  : ", query)

            const cursor = applicationCollections.find(query);
            // .sort({ reviewPostDate: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })


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

        //////////////////////////// job Application Query Section End //////////////////////////////////////////////




        //////////////////////////// Saved Job Query Section Start//////////////////////////////////////////////        
        // query to save a jab as favorite
        app.post('/savedjobs', async (req, res) => {
            const savedjob = req.body;
            result = await savedJobCollections.insertOne(savedjob);
            res.send(result);
        })


        app.get('/savedjobs', async (req, res) => {
            const query = {};
            const result = await savedJobCollections.find(query).toArray();
            res.send(result);
        })


        // show all saved job by job seeker email
        app.get('/jobseekersavedjobs', async (req, res) => {

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = savedJobCollections.find(query).sort({ savedDate: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })
        //////////////////////////// Saved Job Query Section End//////////////////////////////////////////////




        //////////////////////////// User query Section start //////////////////////////////////////////////

        // query to save a new user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            res.send(result);
        });

        // query to show all users
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollections.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        // query to show all employer
        app.get('/employers', async (req, res) => {
            const query = { userType: { $eq: "employer" } };
            const cursor = userCollections.find(query);
            const employers = await cursor.toArray();
            res.send(employers);
        });

        // query to show all jobseeker
        app.get('/jobseekers', async (req, res) => {
            const query = { userType: { $eq: "jobseeker" } };
            const cursor = userCollections.find(query);
            const jobseekers = await cursor.toArray();
            res.send(jobseekers);
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
                    // email: user.email,
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

        //////////////////////////// User query Section end //////////////////////////////////////////////




        //////////////////////////// Employer Query Section Start //////////////////////////////////////////////

        // query to save a employee Profile
        app.post('/emplyerProfile', async (req, res) => {
            const employer = req.body;
            const result = await employerCollections.insertOne(employer);
            res.send(result);
        });


        // query to show a employer by emailid
        app.get('/employer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const employer = await employerCollections.findOne(query);
            res.send(employer);
        })


        // show all application by job seeker email
        app.get('/postedjob', async (req, res) => {

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = jobCollections.find(query).sort({ postDate: -1 });
            // .sort({ applicationDate: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })

        //////////////////////////// Employer Query Section End //////////////////////////////////////////////



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