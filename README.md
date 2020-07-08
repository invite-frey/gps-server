# Tracking Data Server for Xexun Trackers

A simple NodeJS server to receive tracking data from the popular Xexun trackers, including but not limited to the following:

* XT009
* TK102
* TK102-2
* TK103
* TK103-2

Features:

* Receive tracking data over TCP/IP
* Send commands to tracker over TCP/IP
* Write tracking data to MySQL and/or InfluxDB

### Prerequisites

* [NodeJS](https://nodejs.org/en/)
* MySQL or MariaDB
* InfluxDB
* A server able to run NodeJS apps. A set of [daemontools](http://cr.yp.to/daemontools.html) service scripts is included for reference.
* A Xexun tracker for generating tracking data.

If you don't need InfluxDB or MySQL, simply remove all references to either one from bus.js

### Installation

#### Get the files

```
$ wget https://github.com/invite-frey/gps-server.git
```
Move the gps-server directory to your desired location, for example /var/apps

#### Setup a MySQL Database

Create a MySQL database

```
$ mysql -u youruser -p
mysql> CREATE DATABASE gps;
mysql> GRANT ALL PRIVILEGES ON gps.* to yourdbuser@localhost IDENTIFIED BY 'yoursecretpassword';
mysql> FLUSH PRIVILEGES;
mysql> exit
```
  
Create the database table using the schema in the [db_schema.sql](db_schema.sql) file.

```
$ mysql -u youruser -p gps < db_schema.sql
```

#### If you are using daemontools:

* Update the files in service/env to match your own setup
* Link the service directory to your system's service directory

```
$ ln -s /path/to/git-package/service /etc/service/gps-server
```
* Check that the service is running (up more than a few seconds)

```
$ sudo svstat /etc/service/gps-server
[sudo] password for xxx: 
/etc/service/gps-server: up (pid 28000) 19770527 seconds
```

#### You can also start the server from any terminal:

```
$ node app.js
```

### Sending Commands to Tracker

Edit [bus.js](app/bus.js) and set the following constants:

* admin_pwd //The admin password you have set for your tracker. The dafault is 123456
* gps_setting_commands //An array with commands to send to the tracker each time it calls your server.

### Security

Note that the Xexun trackers communicate over TCP/IP in clear text. This means all information transmitted is liable to be intercepted by a third party. Currently there is no version of the firmware that supports encrypted communication. This may make this server and all Xexun trackers unsuitable for commercial implementations with strict security requirements.

In order to limit which trackers are able to write to the database you can implement your own authentication in [auth.js](app/auth.js). The file has one function verify(string). The string parameter is any string that can identify a tracker, by default it's the imei code for the tracker.

The server checks that the data received matches a valid set of data produced by a Xexun tracker, before it forwards it to be written into the database. 

## Authors

* **Frey Mansikkaniemi** - [InviteFrey](https://github.com/invite-frey)

## Donations

Donations are much appreciated if you found this resource useful. 

* Bitcoin: 32AULufQ6AUzq9jKZdcLjSxfePZbsqQKEp
* BTC Lightning via tippin.me: https://tippin.me/@freyhk

## Versioning

* 1.0 - First Release

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details