<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
// The Auto Routing (Legacy) is very dangerous. It is easy to create vulnerable apps
// where controller filters or CSRF protection are bypassed.
// If you don't want to define all routes, please use the Auto Routing (Improved).
// Set `$autoRoutesImproved` to true in `app/Config/Feature.php` and set the following to true.
// $routes->setAutoRoute(false);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->options('/update', 'CORSController::handleOptions');
$routes->options('/delete', 'CORSController::handleOptions');
//MESSAGES
$routes->get('/index', 'Messages::index');
$routes->post('/admin', 'Messages::create');
$routes->post('/messages', 'Messages::getAll');
$routes->delete('/delete', 'Messages::deleteAdmin');
$routes->post('/session', 'Messages::sessionG');
$routes->put('/update', 'Messages::update');

//MESSAGES
$routes->post('/create-bug', 'Bugs::create');

//PROCESSES
$routes->get('/api/worldtour', 'Process::worldTour');
$routes->post('/api/uploadfile', 'Process::convertToJson');
/* $routes->get('/api/ph', 'Process::phMap'); */
/* $routes->post('/api/philippinesmap', 'Process::philippines');
$routes->post('/api/phregion', 'Process::phRegion'); */

//ADMINS
$routes->post('/admin/login', 'Admins::adminLogin');
$routes->post('/admin/logout', 'Admins::adminLogout');

//TRAFFIC
$routes->post('/logtraffic', 'Traffics::log');
$routes->get('/get/logtraffic', 'Traffics::getlog');
$routes->get('/get/timelog', 'Traffics::getTime');

/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (is_file(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
