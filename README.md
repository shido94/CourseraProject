# glowperfect
An appointment booking application for small businesses 

# Introduction
My Appointments booking application for shops and service based businesses. The
application aims to solve the di􀃕culty which users and service o􀃗ering business like
clinics,saloons,hotels would go through when reserving or allotting a spot for the service.
# Design and Implementation
/signupappointment
performs a POST request which sign ups the user and sends the required appointment
details
/login
performs a POST request and retrieves the details of the user and the appointments of
user
/dashboard
performs a GET request and retrieve the list of all the appointments from users
/cancelappointment
performs a POST request to cancel the appointments
# Communication
Endpoint will be called on page load and cancellation requests will be called via AJAX from
frontend
Database Schemas, Design and Structure
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
# Conclusions
1. Users can sign up and 􀃒x appointments
2. Users can cancel appointments
3. Admin or shop owners can view or cancel all appointments.
References
www.practo.com
