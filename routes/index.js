var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');

var nodmailer=require('nodemailer');
var xoauth2 = require('xoauth2');



var transporter=nodmailer.createTransport({
       service:'gmail',
       auth: {
        user: 'glowperfect.blr@gmail.com',
        pass: 'Purush123$'
    }});


function mailSender(appointmentDetails){
      

      var mailBody= appointmentDetails.name + '\n' + appointmentDetails.services +'\n'+ appointmentDetails.mobile +'\n' + appointmentDetails.locality;

      var mailOptions={
        from:'GlowPerfect <glowperfect.blr@gmail.com>',
        to:'purush97k@gmail.com,gouthi.friends@gmail.com',
        subject:'Appoint Request',
        text:mailBody
      };

      transporter.sendMail(mailOptions,function(err,res){
          if(err){
               console.log('err')
          }

          else{
           console.log('email Sent')
          }
      })



}




//Purush123$
/* GET home page. */
router.get('/', function(req, res, next) {
    req.session.destroy(function(err, next) {
        if (err) { next() }
    })
    res.render('index', { title: 'Express' });
});



mongoose.connect('mongodb://purush:Purush123@ds139781.mlab.com:39781/glowperfect', function(err, result, next) {
    if (err) {
        
        //res.send('database connection error occurred try again sometime');
        console.log('could not connect to database')
    }

})


var userSchema = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    password: String,
    super: Boolean
});

var appointmentSchema = mongoose.Schema({
    services: String,
    email: String,
    name:String,
    mobile:String,
    locality: String,
    date: String,
    status: String,
    reason:String
});


var user = mongoose.model('user', userSchema);
var appointment = mongoose.model('appointment', appointmentSchema);


/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Express' });
});


function findAppointments(email, req, res) {

    appointment.find({ email: email }).sort({ date: -1 }).exec(function(err, model) {
        //console.log(model)
        if (err) {
            res.send('Unable to retrieve appointments');
        } 
        else {


            //console.log(model);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            var servicesList = model;

            for (i = 0; i < servicesList.length; i++) {
                var date = servicesList[i].date;
                var repDate = date.split('/');
                var actdate = repDate[2].split(' ');
                var a = parseInt(repDate[1]);

                var monthName = monthNames[parseInt(repDate[1])];
                servicesList[i]['_doc']["parsedDay"] = actdate[0];
                servicesList[i]['_doc']["parsedMonth"] = monthName;
               
            }
            req.session.userprofile.servicesList = servicesList

            //res.send(servicesList);
            res.redirect('dashboard');
        }
    });
}




function findAppointmentsadmin(req, res) {

    appointment.find().sort({ date: -1 }).exec(function(err, model) {
        //console.log(model)
        if (err) {
            res.send('Unable to retrieve appointments');
        } 
        else {


            //console.log(model);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            var servicesList = model;

            for (i = 0; i < servicesList.length; i++) {
                var date = servicesList[i].date;
                var repDate = date.split('/');
                var actdate = repDate[2].split(' ');
                var a = parseInt(repDate[1]);

                var monthName = monthNames[parseInt(repDate[1])];
                servicesList[i]['_doc']["parsedDay"] = actdate[0];
                servicesList[i]['_doc']["parsedMonth"] = monthName;
               
            }
            req.session.userprofile.servicesList = servicesList

            //res.send(servicesList);
            res.redirect('dashboardadmin');
        }
    });
}




router.post('/signupappointment', function(req, res, next) {

    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var fulldate = utc + ' ' + hours + ':' + minutes;

    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.tel;
    var locality = req.body.locality;
    var password = req.body.password;
    var services = req.body.checks;

    var mailBody={services:services,mobile:mobile,locality:locality,name:name,email:email};


 // services: String,
 //    email: String,
 //    name:String,
 //    mobile:String,
 //    locality: String,
 //    date: String,
 //    status: String,
 //    reason:String

    var newUser = new user({ name: name, email: email, mobile: mobile, password: password, super: false });
    var newAppoinment = new appointment({ services: services, email: email, name:name, mobile:mobile, locality: locality, date: fulldate, status: 'Request received',reason:'' });



    function saveappointement() {
        newAppoinment.save(function(err, model, next) {

            if (err) {
                res.send('could not service request please try again')
            } else {

                var userprofile = { name: name, email: email, mobile: mobile, service: true };
                req.session.userprofile = userprofile;
                

                mailSender(mailBody);
                findAppointments(email, req, res);


            }

        })
    };

    user.findOne({ email: email }, function(err, model, next) {


        if (err) {
            next();
            res.send('some error occurred please try again');

        } else if (model != null) {
            res.render('index', { title: 'GLow Perfect', email: model.email });
        } else {
            newUser.save(function(err, model, next) {
                if (err) {
                    res.send('could not save data please try again later');
                } else {
                    saveappointement();
                }

            });

        }
    })

});


router.post('/loginuser', function(req, res, next) {

    var email = req.body.email;
    var password = req.body.password;


    user.findOne({ email: email, password: password }, function(err, model, next) {
        if (err) {
            next();
            res.send('Connection Error')
        } else if (model == null) {
            res.render('login', { title: 'Login', error: 'Invalid email or password' });

        } else {

            var userprofile = { name: model.name, email: model.email, mobile: model.mobile, service: false };
            req.session.userprofile = userprofile;
            console.log(model);
            if(model.super){
            	       findAppointmentsadmin(req,res);
                       //res.send('super user');
            }
            else{


            findAppointments(email, req, res);

                 }
        }

    });

})


router.get('/dashboard', function(req, res, next) {

    if (req.session.userprofile == undefined) {
        res.redirect('/')
    }

    res.render('dashboard', { title: 'Dashboard', userprofile: req.session.userprofile });

});


router.get('/dashboardadmin', function(req, res, next) {

    if (req.session.userprofile == undefined) {
        res.redirect('/')
    }

    res.render('dashboardadmin', { title: 'Dashboard', userprofile: req.session.userprofile });

});


router.post('/fixappointment', function(req, res, next) {
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var fulldate = utc + ' ' + hours + ':' + minutes;

    var useremail = req.session.userprofile.email;

    var services = req.body.checks;
    var email = req.session.userprofile.email;
    var name= req.session.userprofile.name;
    var mobile = req.session.userprofile.mobile;    
    var locality = req.body.locality;
    
    var mailBody={services:services,mobile:mobile,locality:locality,name:name,email:email};

    var newAppoinment = new appointment({  services: services, email: email, name:name, mobile:mobile, locality: locality, date: fulldate, status: 'Request received',reason:'' });

    newAppoinment.save(function(err, model) {
        if (err) {
            res.send('unable to send appointment request');
        } else {
            req.session.userprofile.service = true;
            mailSender(mailBody);
            findAppointments(email, req, res);
        }
    })




});


router.get('/about', function(req, res) {

    res.render('about', { title: 'About Us' })

});

router.post('/cancelappointment', function(req, res) {
    var query = { _id: req.body.cancelid }
    appointment.findOneAndUpdate(query, { status: 'Canceled' }, function(err, model, next) {
            if (err) {
                res.send('Unable to cancel the appointment please try again later')
            } else {
                var email = req.session.userprofile.email;
                findAppointments(email, req, res);
            }
        })
        //res.send('ok')
})



router.post('/cancelappointmentadmin', function(req, res) {
    var query = { _id: req.body.cancelid }
    var reason= req.body.reason;
    appointment.findOneAndUpdate(query, { status: 'Canceled',reason:reason }, function(err, model, next) {
            if (err) {
                res.send('Unable to cancel the appointment please try again later')
            } else {
                var email = req.session.userprofile.email;
                findAppointmentsadmin(req, res);
            }
        })
        //res.send('ok')
})

module.exports = router;
