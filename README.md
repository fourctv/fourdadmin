# FourD Admin
A 4D Database Admin Web App.

[![Build Status](https://travis-ci.org/fourctv/fourdadmin.svg?branch=master)](https://travis-ci.org/fourctv/fourdadmin)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/fourctv/fourdadmin.svg)](https://david-dm.org/fourctv/fourdadmin)
[![devDependency Status](https://david-dm.org/fourctv/fourdadmin/dev-status.svg)](https://david-dm.org/fourctv/fourdadmin#info=devDependencies)

This web app is built upon the [TeamMaestro](https://github.com/TeamMaestro/angular-native-seed) Angular seed.

This web app allows users to directly browse a 4D Database backend and create/edit/delete records. It also provides a 4D Choice List Editor.

**Handle with GREAT CARE.** The app already validates that user has **_Admin_** privileges, but **I'd be VERY CAREFUL making this web app available on a production site!** **MOST SPECIALLY ON A PUBLIC ACCESSIBLE WEB SITE.** It is great for development and testing, though. 

The `distribution` folder includes a built version of the *FourDAdmin* web app. You can download the .zip file in there and copy its contents to a subfolder in your application's `Webfolder`. If you have the **RESTApi** Component installed in your 4D structure, you will be able to browse and edit your database records and choice lists.

There is also an experimental mobile version with basically the same functionality, except for editing records in the database. [see](https://github.com/fourctv/fourdadmin/wiki)

And do not forget to look at additional, more detailed, documentation on the [wiki pages](https://github.com/fourctv/fourdadmin/wiki).

## Browse Table Records

![](https://i.gyazo.com/fef59deaf0d9095e0c56c94fbdd12b60.gif)

## Edit Records

![](https://i.gyazo.com/7f28589c9b049f39dad3d7c3cd3debaa.gif)

## Edit 4D Choice List

![](https://i.gyazo.com/0cae0653ad68f48fd9644996c7b51228.gif)


It relies on Pascal's [4D RESTApi](https://github.com/fourctv/FourDRESTApi) being installed on the 4D Database backend.


## Mobile Version
![](https://fourctv.github.io/FourDAdminMobile.mov)
