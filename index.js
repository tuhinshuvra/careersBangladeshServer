const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
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

        const jobSeekersPersonalDetails = client.db('careersBangladeshDB').collection('empPersonal');
        const jobSeekersExperiences = client.db('careersBangladeshDB').collection('empExperiences');
        const jobSeekersAcademics = client.db('careersBangladeshDB').collection('empAcademics');
        const jobSeekersCareers = client.db('careersBangladeshDB').collection('empCareers');
        const jobSeekersReferences = client.db('careersBangladeshDB').collection('empReferences');


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
            // console.log("search data : ", search)
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
            // console.log("search data : ", search)
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

            const query = {
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

        // // api to show a employer by id
        // app.get('/employer/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const objectedId = { _id: ObjectId(id) };
        //     const employer = await employerCollections.findOne(objectedId);
        //     res.send(employer);
        // })


        // api to update employer profile
        app.put('/employerupdate/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const employer = req.body;

            // console.log("Employers Updated Data : ", employer)
            const options = { upsert: true };

            const updatedData = {
                $set: {
                    companyNameEn: employer.companyNameEn,
                    organizationType: employer.organizationType,
                    companyNameBn: employer.companyNameBn,

                    companyLogo: employer.companyLogo,
                    estdYear: employer.estdYear,
                    companySize: employer.companySize,
                    addressEng: employer.addressEng,
                    addressBng: employer.addressBng,
                    busiDescription: employer.busiDescription,

                    tradeLicense: employer.tradeLicense,
                    websiteURL: employer.websiteURL,
                    contactPersonName: employer.contactPersonName,
                    contactPersonDesignation: employer.contactPersonDesignation,
                    contactPersonEmail: employer.contactPersonEmail,
                    contactPersonPhone: employer.contactPersonPhone,
                }
            }

            const result = await employerCollections.updateOne(filter, updatedData, options)
            res.send(result);
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
        // app.get('/employers/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email }
        //     const employer = await employerCollections.findOne(query);
        //     res.send({ isEmployerActivated: employer?.email === email });
        // })

        //////////////////////////// Employer api Section End //////////////////////////////////////////////





        //////////////////////////// Job Seeker api Section Start //////////////////////////////////////////////     

        // api to save a jobseekers Profile
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


        // api to save a jobseekers's Personal Details
        app.post('/employeesPersonal', async (req, res) => {
            const savedData = req.body;

            const query = {
                email: savedData.email,
            }

            const alreadySaved = await jobSeekersPersonalDetails.find(query).toArray();

            if (alreadySaved.length) {
                const message = `Personal Details data of  this person already saved`;
                return res.send({ acknowledged: false, message })
            }

            const result = await jobSeekersPersonalDetails.insertOne(savedData);
            res.send(result);
        });


        // api to show jobseekers's Personal Details Data
        app.get('/employeesPersonal', async (req, res) => {
            const query = {};
            const result = await jobSeekersPersonalDetails.find(query).toArray();
            res.send(result);
        });

        // api to show jobseekers's Personal Details Data by id
        app.get('/employeesPersonal/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            // console.log("employeesPersonal email : ", email)

            const result = await jobSeekersPersonalDetails.findOne(query);
            // console.log("employeesPersonal result : ", result)
            res.send(result);
        });


        // api to update jobseekers personal data
        app.put('/employeesPersonal/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const jobSeeker = req.body;

            console.log("jobSeeker Updated Data : ", jobSeeker)
            const options = { upsert: true };

            const updatedData = {
                $set: {

                    name: jobSeeker.name,
                    fathersName: jobSeeker.fathersName,
                    mothersName: jobSeeker.mothersName,
                    phone: jobSeeker.phone,
                    birthDate: jobSeeker.birthDate,
                    nationality: jobSeeker.nationality,
                    nationalId: jobSeeker.nationalId,
                    gender: jobSeeker.gender,
                    religion: jobSeeker.religion,
                    maritalStatus: jobSeeker.maritalStatus,
                    image: jobSeeker.image,
                    permanentAddress: jobSeeker.permanentAddress,
                    presentAddress: jobSeeker.presentAddress,
                    careerObjective: jobSeeker.careerObjective,
                }
            }

            const result = await jobSeekersPersonalDetails.updateOne(filter, updatedData, options)
            res.send(result);
        })


        // api to show jobseekers's employeesExpriences Data by id
        app.get('/employeesExpriences/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const result = await jobSeekersExperiences.findOne(query);
            res.send(result);
        });



        // api to update jobseekers's employeesExpriences Data by id

        app.put('/jobseekersExperiences/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const jobSeeker = req.body;
            // console.log("jobSeeker Experience Data", jobSeeker);

            const options = { upsert: true };

            const updatedData = {
                $set: {
                    expOneCompanayName: jobSeeker.expOneCompanayName,
                    expOneCompanayBusiness: jobSeeker.expOneCompanayBusiness,
                    expOneDepartment: jobSeeker.expOneDepartment,
                    expOneDesignation: jobSeeker.expOneDesignation,
                    exprOneResp: jobSeeker.exprOneResp,
                    exprOneExpertise: jobSeeker.exprOneExpertise,
                    expOneFrom: jobSeeker.expOneFrom,
                    expOneTo: jobSeeker.expOneTo,
                    exprCompOneAddress: jobSeeker.exprCompOneAddress,

                    expTwoCompanayBusiness: jobSeeker.expTwoCompanayBusiness,
                    expTwoCompanayName: jobSeeker.expTwoCompanayName,
                    expTwoDepartment: jobSeeker.expTwoDepartment,
                    expTwoDesignation: jobSeeker.expTwoDesignation,
                    expTwoFrom: jobSeeker.expTwoFrom,
                    expTwoTo: jobSeeker.expTwoTo,
                    exprTwoExpertise: jobSeeker.exprTwoExpertise,
                    exprTwoResp: jobSeeker.exprTwoResp,
                    exprCompTwoAddress: jobSeeker.exprCompTwoAddress,
                }
            }

            const result = await jobSeekersExperiences.updateOne(filter, updatedData, options);
            res.send(result);
        })


        // api to show  jobseeker academic and training Data by id
        app.get('/jobseekersAcademics/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }

            // console.log("Job Seeker academic and training Data Email", email);
            const result = await jobSeekersAcademics.findOne(query);
            res.send(result);
        })


        // api to update  jobseekers academic and training data update
        app.put('/jobseekersAcademics/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const jobSeeker = req.body;

            // console.log("jobSeeker academic and training Data", jobSeeker);

            const options = { upsert: true };

            const updatedData = {

                $set: {
                    examTitleOne: jobSeeker.examTitleOne,
                    majorOne: jobSeeker.majorOne,
                    instituteOne: jobSeeker.resultOne,
                    resultOne: jobSeeker.resultOne,
                    passYearOne: jobSeeker.passYearOne,

                    examTitleTwo: jobSeeker.examTitleTwo,
                    majorTwo: jobSeeker.majorTwo,
                    instituteTwo: jobSeeker.instituteTwo,
                    resultTwo: jobSeeker.resultTwo,
                    passYearTwo: jobSeeker.passYearTwo,

                    examTitleThree: jobSeeker.examTitleThree,
                    majorThree: jobSeeker.majorThree,
                    instituteThree: jobSeeker.instituteThree,
                    resultThree: jobSeeker.resultThree,
                    passYearThree: jobSeeker.passYearThree,

                    examTitleFour: jobSeeker.examTitleFour,
                    majorFour: jobSeeker.majorFour,
                    instituteFour: jobSeeker.instituteFour,
                    resultFour: jobSeeker.resultFour,
                    passYearFour: jobSeeker.passYearFour,

                    trainingTitleOne: jobSeeker.trainingTitleOne,
                    topicOne: jobSeeker.topicOne,
                    insAndLocationOne: jobSeeker.insAndLocationOne,
                    durationOne: jobSeeker.durationOne,
                    traningYearOne: jobSeeker.traningYearOne,

                    trainingTitleTwo: jobSeeker.trainingTitleTwo,
                    topicTwo: jobSeeker.topicTwo,
                    insAndLocationTwo: jobSeeker.insAndLocationTwo,
                    durationTwo: jobSeeker.durationTwo,
                    traningYearTwo: jobSeeker.traningYearTwo,

                    trainingTitleThree: jobSeeker.trainingTitleThree,
                    topicThree: jobSeeker.topicThree,
                    insAndLocationThree: jobSeeker.insAndLocationThree,
                    durationThree: jobSeeker.durationThree,
                    traningYearThree: jobSeeker.traningYearThree,


                    gitHubLink: jobSeeker.gitHubLink,
                    linkTwo: jobSeeker.linkTwo,
                    linkThree: jobSeeker.linkThree,
                    portfolio: jobSeeker.portfolio,
                }
            }
            const result = await jobSeekersAcademics.updateOne(filter, updatedData, options);
            res.send(result);
        })

        // api to show jobseekrs  Careers and Skill Data by id
        app.get('/employeesCareers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }

            // console.log("Job Seeker Academics Data", email);
            const result = await jobSeekersCareers.findOne(query);
            res.send(result);
        })


        // api to update jobseekrs  Careers and  Skill Data by id
        app.put('/jobseekersCareersSkill/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const jobSeeker = req.body;

            // console.log("jobSeeker Careers Data", jobSeeker);

            const options = { upsert: true };

            const updatedData = {
                $set: {
                    lookingFor: jobSeeker.lookingFor,
                    availbaleFor: jobSeeker.availbaleFor,
                    presentSalary: jobSeeker.presentSalary,
                    expectedSalary: jobSeeker.expectedSalary,
                    category: jobSeeker.category,
                    preferredLocations: jobSeeker.preferredLocations,
                    preferredOrg: jobSeeker.preferredOrg,

                    skillOne: jobSeeker.skillOne,
                    skillTwo: jobSeeker.skillTwo,
                    skillThree: jobSeeker.skillThree,
                    skillFour: jobSeeker.skillFour,
                    skillFive: jobSeeker.skillFive,
                    skillSix: jobSeeker.skillSix,
                    skillSeven: jobSeeker.skillSeven,
                    skillEight: jobSeeker.skillEight,
                    skillNine: jobSeeker.skillNine,
                    skillTen: jobSeeker.skillTen,
                    skillLearnedBy: jobSeeker.skillLearnedBy,
                    skillDesciption: jobSeeker.skillDesciption,
                    specialQualification: jobSeeker.specialQualification,
                }
            }

            const result = await jobSeekersCareers.updateOne(filter, updatedData, options);
            res.send(result);
        })


        // api to show  Languages and References Data by id
        app.get('/employeesReferences/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }

            // console.log("Job Seeker Academics Data", email);
            const result = await jobSeekersReferences.findOne(query);
            res.send(result);
        })


        // api to update  Languages ans References Data by id
        app.put('/jobseekersLanguagesReferences/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const jobSeeker = req.body;

            // console.log("jobSeeker Languages ans References Data", jobSeeker);

            const options = { upsert: true };

            const updatedData = {
                $set: {
                    languOne: jobSeeker.languOne,
                    writingOne: jobSeeker.writingOne,
                    readingOne: jobSeeker.readingOne,
                    speakingOne: jobSeeker.speakingOne,

                    languTwo: jobSeeker.languTwo,
                    writingTwo: jobSeeker.writingTwo,
                    readingTwo: jobSeeker.readingTwo,
                    speakingTwo: jobSeeker.speakingTwo,

                    languThree: jobSeeker.languThree,
                    readingThree: jobSeeker.readingThree,
                    writingThree: jobSeeker.writingThree,
                    speakingThree: jobSeeker.speakingThree,

                    refOneName: jobSeeker.refOneName,
                    refOneDetails: jobSeeker.refOneDetails,
                    refTwoName: jobSeeker.refTwoName,
                    refTwoDetails: jobSeeker.refTwoDetails,

                    other: jobSeeker.other,
                }
            }

            const result = await jobSeekersReferences.updateOne(filter, updatedData, options);
            res.send(result);
        })


        // api to save a jobseeker's Experience Data
        app.post('/employeesExperiences', async (req, res) => {
            const reqestedData = req.body;


            const query = {
                email: reqestedData.email,
            }

            const alreadySaved = await jobSeekersExperiences.find(query).toArray();

            if (alreadySaved.length) {
                const message = `Experience data of this person already saved, you can edit data in manage profile`;
                return res.send({ acknowledged: false, message })
            }


            const result = await jobSeekersExperiences.insertOne(reqestedData);
            res.send(result);
        });


        // api to show jobseeker's Experience Data
        app.get('/employeesExperiences', async (req, res) => {
            const query = {};
            const result = await jobSeekersExperiences.find(query).toArray();
            res.send(result);
        });


        // api to save a jobseeker's Academic and Training Data
        app.post('/employeesAcademics', async (req, res) => {
            const reqestedData = req.body;

            const query = {
                email: reqestedData.email,
            }

            const alreadySaved = await jobSeekersAcademics.find(query).toArray();

            if (alreadySaved.length) {
                const message = `Academic and Training data of this person already saved, , you can edit data in manage profile`;
                return res.send({ acknowledged: false, message })
            }


            const result = await jobSeekersAcademics.insertOne(reqestedData);
            res.send(result);
        });


        // api to show jobseeker's Academic and Training Data
        app.get('/employeesAcademics', async (req, res) => {
            const query = {};
            const result = await jobSeekersAcademics.find(query).toArray();
            res.send(result);
        });


        // api to save a jobseeker's Career and Skill Data
        app.post('/employeesCareers', async (req, res) => {
            const dataList = req.body;

            const query = {
                email: dataList.email,
            }

            const alreadySaved = await jobSeekersCareers.find(query).toArray();

            if (alreadySaved.length) {
                const message = `Career and Skill Data of this person already saved,  you can edit data in manage profile`;
                return res.send({ acknowledged: false, message })
            }

            const result = await jobSeekersCareers.insertOne(dataList);
            res.send(result);
        });


        // api to show jobseeker's Career and Skill Data
        app.get('/employeesCareers', async (req, res) => {
            const query = {};
            const result = await jobSeekersCareers.find(query).toArray();
            res.send(result);
        });


        // api to save a jobseeker's Languages and References
        app.post('/employeesReferences', async (req, res) => {
            const dataList = req.body;

            const query = {
                email: dataList.email,
            }

            const alreadySaved = await jobSeekersReferences.find(query).toArray();

            if (alreadySaved.length) {
                const message = `Languages and References data of this person already saved, you can edit data in manage profile`;
                return res.send({ acknowledged: false, message })
            }

            const result = await jobSeekersReferences.insertOne(dataList);
            res.send(result);
        });


        // api to show jobseeker's Languages and References
        app.get('/employeesReferences', async (req, res) => {
            const query = {};
            const result = await jobSeekersReferences.find(query).toArray();
            res.send(result);
        });



        // aggregation of employees all primary data collections
        // app.get('/employeesAggregatedData', async (req, res) => {
        app.get('/employeesAggregatedData/:email', async (req, res) => {
            // const email = 'salam@gmail.com';
            const email = req.params.email;
            // const query = { email };

            // const checkExperience = await jobSeekersExperiences.find(query).toArray();
            // const checkAcademics = await jobSeekersAcademics.find(query).toArray();
            // const checkCareers = await jobSeekersCareers.find(query).toArray();
            // const checkReference = await jobSeekersReferences.find(query).toArray();

            // if (checkExperience.length = 0) {
            //     console.log('Experience data not saved yet');
            // }
            // else if (checkAcademics.length = 0) {
            //     console.log('Academics data not saved yet');
            // }
            // else if (checkCareers.length = 0) {
            //     console.log('Careers data not saved yet');
            // }
            // else if (checkReference.length = 0) {
            //     console.log('Reference data not saved yet');
            // }


            const employeesData = await jobSeekersPersonalDetails.aggregate([

                { $match: { email: { '$eq': email } } },

                // {$cond: { if: { $gte: [ "$qty", 250 ] }, then: 30, else: 20 }},

                // if (checkExperience.length) { }
                // personal collection aggregate with academics collection
                {
                    $lookup: {
                        from: 'empAcademics',
                        localField: 'email',
                        foreignField: 'email',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$email", email]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    email: 0,
                                    name: 0,
                                }
                            },
                        ],
                        as: 'empAggreAcademics'
                    },
                },
                { $unwind: "$empAggreAcademics" },


                // personal collection aggregate with experience collection
                {
                    $lookup: {
                        from: 'empExperiences',
                        localField: 'email',
                        foreignField: 'email',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$email", email]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    email: 0,
                                }
                            },
                        ],
                        as: 'empAgrreExperience'
                    },
                },
                { $unwind: "$empAgrreExperience" },


                // personal collection aggregate with careers collection
                {
                    $lookup: {
                        from: 'empCareers',
                        localField: 'email',
                        foreignField: 'email',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$email", email]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    email: 0,
                                    name: 0,
                                }
                            },
                        ],
                        as: 'empAggreCareers'
                    },
                },
                { $unwind: "$empAggreCareers" },


                // personal collection aggregate with refference collection
                {
                    $lookup: {
                        from: 'empReferences',
                        localField: 'email',
                        foreignField: 'email',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$email", email]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    email: 0,
                                    name: 0,

                                }
                            },
                        ],
                        as: 'empAggreReferences'
                    },
                },
                { $unwind: "$empAggreReferences" },



            ]).toArray();

            res.send(employeesData);
        });
        // db.vehicledetails.aggregate([{$unwind : "$model_year" }]).pretty()

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