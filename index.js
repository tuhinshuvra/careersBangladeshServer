const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { api } = require('express');
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
        const employeePersonalDetails = client.db('careersBangladeshDB').collection('empPersonal');
        const employeeExperiences = client.db('careersBangladeshDB').collection('empExperiences');
        const employeeAcademics = client.db('careersBangladeshDB').collection('empAcademics');
        const employeeCareers = client.db('careersBangladeshDB').collection('empCareers');
        const employeeReferences = client.db('careersBangladeshDB').collection('empReferences');


        const subscriberCollections = client.db('careersBangladeshDB').collection('subscribers');

        const applicationCollections = client.db('careersBangladeshDB').collection('applications');
        const savedJobCollections = client.db('careersBangladeshDB').collection('savedJobs');



        //////////////////////////// job Category api Section Start//////////////////////////////////////////////

        // api to save a Job Category
        app.post('/jobCategories', async (req, res) => {
            const category = req.body;
            const result = await jobCategoriesCollections.insertOne(category);
            res.send(result);
        });


        // api to show Job Categories
        app.get('/jobCategories', async (req, res) => {
            const query = {};
            const cursor = jobCategoriesCollections.find(query);
            const category = await cursor.toArray();
            res.send(category);
        });


        // // api to delete a JobCategory
        // app.delete('/jobCategories/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await jobCategoriesCollections.deleteOne(query);
        //     res.send(result);
        //     // console.log('trying to delete', id);
        // });

        //////////////////////////// job Category api Section End//////////////////////////////////////////////




        //////////////////////////// job Post api Section Start//////////////////////////////////////////////
        // api to save a Job
        app.post('/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobCollections.insertOne(job);
            res.send(result);
        });


        // api to show Job 
        app.get('/jobs', async (req, res) => {
            const query = {};
            const cursor = jobCollections.find(query).sort({ postDate: -1 });
            const job = await cursor.toArray();
            res.send(job);
        });

        // api to search  Job by search field
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

        // api to show Job 
        app.get('/jobSearchHome/:search', async (req, res) => {
            const search = req.params.search;
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




        // api to delete a saved Job
        app.delete('/savedjob/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await savedJobCollections.deleteOne(query);
            res.send(result);
            // console.log('trying to delete', id);
        });

        //////////////////////////// job Post api Section End//////////////////////////////////////////////




        //////////////////////////// job Application api Section Start //////////////////////////////////////////////  


        // save application on database
        app.post('/applications', async (req, res) => {
            const application = req.body;
            const query = {
                jobId: application.jobId,
                jobSeekerEmail: application.jobSeekerEmail,
            }
            const alreadyApplied = await applicationCollections.find(query).toArray();

            if (alreadyApplied.length) {
                const message = `You have already applied on this job${application.jobTitle}`;
                return res.send({ acknowledged: false, message })
            }

            result = await applicationCollections.insertOne(application);
            res.send(result);
        })


        // api to show all application
        app.get('/applications', async (req, res) => {
            const query = {};
            const cursor = applicationCollections.find(query).sort({ _id: -1 })
            const result = await cursor.toArray();
            res.send(result);
        })


        // show all application by job seeker email
        app.get('/jobseekerapply', async (req, res) => {

            // const decoded = req.decoded;
            // // console.log('inside orders api : ', decoded);
            // if (decoded.email !== req.api.email) {
            //     res.status(403).send({ message: 'Forbidden Access' })
            // }

            let query = {};
            if (req.api.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = applicationCollections.find(query).sort({ applicationDate: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })


        // api to show already applied application
        app.get('/appliedApplications', async (req, res) => {
            const userEmail = req.query.email;
            const jobId = req.query.email;
            const query = { email }
            const user = await applicationCollections.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        //////////////////////////// job Application api Section End //////////////////////////////////////////////




        //////////////////////////// Saved Job api Section Start//////////////////////////////////////////////        
        // api to save a jab as favorite
        app.post('/savedjobs', async (req, res) => {
            const savedjob = req.body;

            const api = {
                jobId: savedjob.jobId,
                email: savedjob.email,
            }

            const alreadySaved = await savedJobCollections.find(query).toArray();


            if (alreadySaved.length) {
                const message = `You have already saved the job `;
                return res.send({ acknowledged: false, message })
            }

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
            if (req.query.jobSeekerEmail) {
                query = {
                    jobSeekerEmail: req.query.jobSeekerEmail
                }
            }
            const cursor = savedJobCollections.find(query).sort({ savedDate: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })
        //////////////////////////// Saved Job api Section End//////////////////////////////////////////////




        //////////////////////////// User api Section start //////////////////////////////////////////////

        // api to save a new user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            res.send(result);
        });

        // api to show all users
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollections.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        // api to show all employer
        app.get('/employers', async (req, res) => {
            const query = { userType: { $eq: "employer" } };
            const cursor = userCollections.find(query);
            const employers = await cursor.toArray();
            res.send(employers);
        });

        // api to show all jobseeker
        app.get('/jobseekers', async (req, res) => {
            const query = { userType: { $eq: "jobseeker" } };
            const cursor = userCollections.find(query);
            const jobseekers = await cursor.toArray();
            res.send(jobseekers);
        });

        // api to show a user by id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollections.findOne(query);

            res.send(user);
        })


        // api to add a user as admin
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


        // api to find admin user by email
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })


        // api to find a employer user by email
        app.get('/users/employer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ isEmployer: user?.userType === "employer" });
        })


        // api to find jobseeker user by email
        app.get('/users/jobseeker/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ isJobSeeker: user?.userType === "jobseeker" });
        })

        // api to update a user
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


        // api to delete a user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollections.deleteOne(query);
            res.send(result);
            // console.log('trying to delete', id);
        });

        //////////////////////////// User api Section end //////////////////////////////////////////////




        //////////////////////////// Employer api Section Start //////////////////////////////////////////////

        // api to save a employee Profile
        app.post('/emplyerProfile', async (req, res) => {
            const employer = req.body;
            const result = await employerCollections.insertOne(employer);
            res.send(result);
        });


        // api to show a employer by emailid
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


        // api to find is employer profile activated or not
        app.get('/employers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const employer = await employerCollections.findOne(query);
            res.send({ isEmployerActivated: employer?.email === email });
        })

        //////////////////////////// Employer api Section End //////////////////////////////////////////////



        //////////////////////////// Job Seeker api Section Start //////////////////////////////////////////////     

        // api to save a jobseeker Profile
        app.post('/jobseekerProfile', async (req, res) => {
            const jobseeker = req.body;
            const result = await jobseekerCollections.insertOne(jobseeker);
            res.send(result);
        });


        // api to show a jobseeker by email
        app.get('/jobseeker/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const jobseeker = await jobseekerCollections.findOne(query);
            res.send(jobseeker);
        })


        // api to save a employee's Personal Details
        app.post('/employeesPersonal', async (req, res) => {
            const personal = req.body;
            const result = await employeePersonalDetails.insertOne(personal);
            res.send(result);
        });


        // api to show employee's Personal Details Data
        app.get('/employeesPersonal', async (req, res) => {
            const query = {};
            const result = await employeePersonalDetails.find(query).toArray();
            res.send(result);
        });


        // api to save a employee's Experience Data
        app.post('/employeesExperiences', async (req, res) => {
            const experience = req.body;
            const result = await employeeExperiences.insertOne(experience);
            res.send(result);
        });


        // api to show employee's Experience Data
        app.get('/employeesExperiences', async (req, res) => {
            const query = {};
            const result = await employeeExperiences.find(query).toArray();
            res.send(result);
        });


        // api to save a employee's Academic and Training Data
        app.post('/employeesAcademics', async (req, res) => {
            const academic = req.body;
            const result = await employeeAcademics.insertOne(academic);
            res.send(result);
        });


        // api to show employee's Academic and Training Data
        app.get('/employeesAcademics', async (req, res) => {
            const query = {};
            const result = await employeeAcademics.find(query).toArray();
            res.send(result);
        });


        // api to save a employee's Career and Skill Data
        app.post('/employeesCareers', async (req, res) => {
            const academic = req.body;
            const result = await employeeCareers.insertOne(academic);
            res.send(result);
        });


        // api to show employee's Career and Skill Data
        app.get('/employeesCareers', async (req, res) => {
            const query = {};
            const result = await employeeCareers.find(query).toArray();
            res.send(result);
        });


        // api to save a employee's Languages and References
        app.post('/employeesReferences', async (req, res) => {
            const references = req.body;
            const result = await employeeReferences.insertOne(references);
            res.send(result);
        });


        // api to show employee's Languages and References
        app.get('/employeesReferences', async (req, res) => {
            const query = {};
            const result = await employeeReferences.find(query).toArray();
            res.send(result);
        });

        //////////////////////////// Job Seeker api Section End //////////////////////////////////////////////



        //////////////////////////// Subscriber api Section Start ////////////////////////////////////////////

        // api to save a suscriber 
        app.post('/subscribers', async (req, res) => {
            const subscriber = req.body;

            const query = {
                subsEmail: subscriber.subsEmail,
            }

            const alreadySubscribed = await subscriberCollections.find(query).toArray();


            if (alreadySubscribed.length) {
                const message = `This email id already subscribed`;
                return res.send({ acknowledged: false, message })
            }

            const result = await subscriberCollections.insertOne(subscriber);
            res.send(result);
        })

        // api to show all suscriber 
        app.get('/subscribers', async (req, res) => {
            const query = {};
            const result = await subscriberCollections.find(query).toArray();
            res.send(result);
        })

        // api to delete a subscriber
        app.delete('/subscribers/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('Want to delete the ID', id)
            const objectedId = { _id: new ObjectId(id) }
            const result = await subscriberCollections.deleteOne(objectedId);
            res.send(result);
        })


        //////////////////////////// Subscriber api Section End //////////////////////////////////////////////


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