<?php
// qr.api.php
// 2018-11-08

// redirect
$app->get('/qr.go/:c', function ($c) {
  $o = new \RG\QR();
  $o->go($c);
});

// get qr record
$app->get('/qr.info/:c', function ($c) {
  $o = new \RG\QR();
  $o->info($c);
});

$app->get('/qr.info2/:c', function ($c) {
  $o = new \RG\QR();
  $o->info($c,true,true);
});

// show qr .png
$app->get('/qr.show/:c', function ($c) {
  $o = new \RG\QR();
  $o->show($c);
});

// insert/update a_qr
$app->post('/qr.save(/:c)', function ($c="") {
  $o = new \RG\QR();
  $o->save($c);
});

// update user profile
// c_email,c_password,...
$app->post('/user.create', function () {
  $o = new \RG\QR();
  $o->createProfile();
});
$app->post('/user.nonce', function () {
  $o = new \RG\QR();
  $o->userNonce();
});

$app->post('/user.profile', function () {
  $o = new \RG\QR();
  $o->updProfile();
});

$app->get('/user.profile', function () {
  $o = new \RG\QR();
  $o->getProfile();
});

$app->post('/user.login', function () {
  $o = new \RG\QR();
  $o->userLogin();
});

$app->post('/user.forgot_password', function () {
  $o = new \RG\QR();
  $o->forgotPassword();
});


$app->post('/qr.media', function () {
  $o = new \RG\QR();
  $o->uploadMedia();
});

$app->get('/qr.media', function () {
  $o = new \RG\QR();
  $o->listMedia();
});

$app->post('/qr.my_contact', function () {
  $o = new \RG\QR();
  $o->reverseContact();
});

$app->get('/qr.cookie', function () {
  $o = new \RG\QR();
  $o->getCookie();
});

$app->get('/qr.myqr', function () {
  $o = new \RG\QR();
  $o->myQR();
});

$app->get('/qr.checkqr(/:c)', function ($c=70) {
  $o = new \RG\QR();
  $o->checkQR($c);
});

$app->post('/qr.track', function () {
  $o = new \RG\QR();
  $o->track();
});

$app->post('/qr.log', function () {
  $o = new \RG\QR();
  $o->log();
});

// Bill 29/4/62 Coupon features
// get sync coupon_distribute of current user

$app->get('/user.coupon', function () {
  $o = new \RG\QR();
  $o->getUserCoupon();
});
$app->get('/user.coupon/:c', function ($c) {
  $o = new \RG\QR();
  $o->getCoupon($c);
});
$app->post('/user.coupon_redeem/:c', function ($c) {
  $o = new \RG\QR();
  $o->redeemCoupon($c);
});
