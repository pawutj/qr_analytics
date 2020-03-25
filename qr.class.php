<?php
// qr.class.php
// 2018-11-07
// borrow some code from http://techbloghunting.com/2018/04/26/how-to-generate-qr-code-using-google-chart-api-in-php/
// google chart qr doc: https://developers.google.com/chart/infographics/docs/qr_codes
namespace RG;

class QR {
  private $codeData;
  // we omit confuse char like 0/o/e/3
  protected static $chars = "123456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";
  // private $trackUrl = "https://myqr.thaicrowd.com/api/v1/qr.go/";
  // private $trackUrl = "https://yourqr.today/api/v1/qr.go/";
  private $trackUrl = "https://yourqr.today/";
  public $checkUrlExists;

  protected static $userDataFolder = "/DATA/myqr/www/user-data/";

  private $config = [
    'googleChartAPI' => 'https://chart.apis.google.com/chart',
    'type' => 'url',     // can be text/url/email/phone,contact,content ... it's a fn.name in this class
    'def' => [
      'chl' => '',
      'choe' => 'UTF-8',
      'chld' => 'H|1'
    ],
    'text' => [
      'font' => APP_BASE.'api-src/fonts/tflanna.ttf',
      'fontSize' => 30,
      'color' => [242,146,88],           // orange
      //'color' => [108, 170, 209],           // blue
      'bgcolor' => [255,255,255],     // white
    ],
    'logo' => ''
  ];

  private $defaultSettings = [
    'c_data' => 'qr data',
    'c_text' => '',
    'i_size' => 500,
    'c_config' => []
  ];

  public function __construct() {
    $this->app = \Slim\Slim::getInstance();
    $this->db  = $this->app->db;
    $this->checkUrlExists = false;
    $this->defaultSettings['c_config'] = $this->config;
  }

  // 2018-11-14
  // add trackUrl
  public function url($url = null){
    $this->codeData = $this->trackUrl.$url;
    // $this->codeData = preg_match("#^https?\:\/\/#", $url) ? $url : "http://{$url}";
  }

  public function text($text){
      $this->codeData = $text;
  }

  public function email($email = null, $subject = null, $message = null) {
      $this->codeData = "MATMSG:TO:{$email};SUB:{$subject};BODY:{$message};;";
  }

  public function phone($phone){
      $this->codeData = "TEL:{$phone}";
  }

  public function sms($phone = null, $msg = null) {
      $this->codeData = "SMSTO:{$phone}:{$msg}";
  }

  public function contact($name = null, $address = null, $phone = null, $email = null) {
      $this->codeData = "MECARD:N:{$name};ADR:{$address};TEL:{$phone};EMAIL:{$email};;";
  }

  public function content($type = null, $size = null, $content = null) {
      $this->codeData = "CNTS:TYPE:{$type};LNG:{$size};BODY:{$content};;";
  }

  // logo can be any image url
  private function overlayLogo(&$QR,$logo) {
    $logo = imagecreatefromstring(file_get_contents($logo));
    $QR_width = imagesx($QR);
    $QR_height = imagesy($QR);

    $logo_width   = imagesx($logo);
    $logo_height  = imagesy($logo);

    // Scale logo to fit in the QR Code
    $logo_qr_width = $QR_width/3;
    $scale = $logo_width/$logo_qr_width;
    $logo_qr_height = $logo_height/$scale;

    imagecopyresampled($QR, $logo, $QR_width/3, $QR_height/3, 0, 0, $logo_qr_width, $logo_qr_height, $logo_width, $logo_height);
    return $QR;
  }

  // $t is array of [text,color,bgcolor,font,angle,x,y]
  // we create text using GD so it is an image. Then merge it with QR
  private function overlayText(&$QR,$t) {
    $t = array_merge($this->config['text'],$t); // merge with default settings
    $QR_width = imagesx($QR);
    $QR_height = imagesy($QR);

    $color    = imagecolorallocate($QR, $t['color'][0], $t['color'][1], $t['color'][2]);
    $bgcolor  = imagecolorallocate($QR, $t['bgcolor'][0], $t['bgcolor'][1], $t['bgcolor'][2]);

    // Retrieve bounding box:
    $type_space = imagettfbbox($t['fontSize'], 0, $t['font'], $t['data']);

    // Determine image width and height, 10 pixels are added for 5 pixels padding:
    $text_width   = abs($type_space[4] - $type_space[0]) + 10;
    $text_height  = abs($type_space[5] - $type_space[1]) + 10;

    $text_box     = imagecreatetruecolor($text_width, $text_height);
    imagefill($text_box, 0, 0, $bgcolor);

    imagettftext($text_box, $t['fontSize'], 0, 5, $text_height - 7, $color, $t['font'], $t['data']);
    // imagettftext($QR, 25, 0, 75, 300, $color, $t['font'], $t['data']);

    // Scale text to fit in the QR Code, and still readable
    // if height more than 17% and width more than 77%, it un-readable
    $w = $QR_width/1.3;
    $scale = $text_width/$w;
    $h = $text_height/$scale;

    // we need to check for text_width overflow QR
    // and minimum width so not expand font when scale
    if ($text_width > $w) $text_width = $w;
    if ($text_width < $QR_width * .5) $w = $text_width + 100;
    $h = $QR_height * .17;
    // w=10 l=4 so x = (10-4)/2
    imagecopyresampled($QR, $text_box, ($QR_width - $w)/2, ($QR_height - $h)/2 , 0, 0, $w, $h, $text_width, $text_height);

    // Destroy image in memory to free-up resources:
    imagedestroy($text_box);
  }


  protected function randomCode($l=6) {
    $code ="";
    for ($i =0,$l2 =strlen(self::$chars)-1;$i <$l; $i++) {
      $code .=self::$chars[rand(0,$l2)];
    }
    return $code;
  }

  public function verifyUrlExists($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch,  CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    $response = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return (!empty($response) && $response != 404);
  }


  public function go($c) {
    $r1 = $this->db->iGetRow("select * from a_qr where c_code=?",[$c]);

    $f1['c_data'] = $r1['c_data'];
    $f1['qr_id'] = $r1['id'];
    $this->stat($f1, 'go');

    $url = $r1['c_data'];
    $url = preg_match("#^https?\:\/\/#", $url) ? $url : "http://{$url}";

    $config = json_decode($r1['c_config'],true);
    if (isset($config['namecard'])) $url = $url."/".$r1['c_code'];

    $this->app->insertUsageLog('redirect to '.$url);

    header("location: $url");
    exit;
  }

  public function show($c) {
    $r1 = $this->db->iGetRow("select * from a_qr where c_code=?",[$c]);
    if(!$r1) { $this->app->sendFail("QR not exist"); }
    $r1['c_config'] = json_decode($r1['c_config'],true);

    // 2018-11-14
    // only url can track by redirecting
    // encode text,url,mecard .... according to data type that store in QR
    if ($r1['c_config']['type'] =='url')
      $this->{$r1['c_config']['type']}($r1['c_code']);
    else $this->{$r1['c_config']['type']}($r1['c_data']);
    $QR = imagecreatefrompng($this->config['googleChartAPI']."?choe={$r1['c_config']['def']['choe']}&chld={$r1['c_config']['def']['chld']}&chs={$r1['i_size']}x{$r1['i_size']}&cht=qr&chl=" . urlencode($this->codeData));

    if ($r1['c_text'] !='') {
      $r1['text']['data'] = $r1['c_text'];
      $this->overlayText($QR,$r1['text']);
    }

    // if we support upload custom logo
    // if ($r1['media_id'] >0) {

    // }
    if ($r1['c_config']['logo'] !='') {
      $this->overlayLogo($QR,$r1['c_config']['logo']);
    }

    // we can record show stat if need, this will help affiliate
    $this->app->insertUsageLog('show qr image');

    header('Content-type: image/png');
    imagepng($QR);
    exit;
  }
  public function save($c = '', $is_ajax=true) {
    $f1 = $this->app->requestBodyArray;
    if (!isset($f1['c_data'])) $this->app->sendFail('c_data is needed');
    $f1 =array_replace_recursive($this->defaultSettings,$f1);

    if ($f1['c_config']['type'] =='url' && !$this->verifyUrlExists($f1['c_data'])) {
      $this->app->sendFail("Url not exist");
    }
    $f1['u_id'] = $this->app->a_user['id'];
    $f1['d_update'] = $this->app->now;

    if($c != '') {
      $f1['c_code'] = $c;
      $r1 = $this->db->iGetRow("select u_id, id from a_qr where c_code=?",[$f1['c_code']]);
      $f1['id'] = $r1['id'];
      $c_type = "edit";
      if($r1['u_id'] != $this->app->a_user['id']) {
        $this->app->sendFail("Not your qr");
      }
      $this->db->iUpdate('a_qr',$f1,['id'=>$f1['id']]);
      $c_type = "edit";
    } else {
      do {
        $f1['c_code'] = $this->randomCode();
        $r1 = $this->db->iGetRow("select c_code from a_qr where c_code=?",[$f1['c_code']]);
      } while($r1);

      $f1['id'] = $this->db->iInsert('a_qr',$f1);
      $c_type = "create";
    }

    // Update user media_id if change
    if (isset($f1['c_config']['namecard'])) {
      $id = $this->app->a_user['id'];
      if($c_type == 'edit') {       
        $f2['c_data'] = $this->trackUrl."/show/".$f1['c_code'];
        $this->statCoupon('profile'); // BILL
      }
      if (isset($id) && isset($f1['media_id']) && $f1['media_id'] != 0) {
        $this->db->iUpdate("a_user",['media_id' => $f1['media_id']],["id" =>$id]);
      }
    }

    $f2['qr_id'] = $f1['id'];
    $this->stat($f2, $c_type);

  if($is_ajax) $this->app->sendOk($f1['c_code']);
  else return $f1['c_code'];
  }

// Bill : temp api to create profile without OTP
  public function createProfile() {
    $f1 = $this->app->requestBodyArray;
    $namecard = $f1['c_config']['namecard'];
    $id = $id =$this->app->a_user['id'];
    $data = [
    "c_email" => $namecard['email'],
    "c_username" => $namecard['email'],
    "c_fname" => $namecard['firstname'],
    "c_lname" => $namecard['lastname'],
    "c_phone_no" => $namecard['telephone']
    ];
    if (isset($id)) {
      $this->db->iUpdate("a_user",$data,["id" =>$id]);
      $this->info($this->save('', false), false);
    }
    else $this->app->sendFail('Invalid of use');
  }

  public function getProfile($id="",$setUUID=false) {
    if ($id=="") $id =$this->app->a_user['id'];
    $r1 = $this->db->iGetRow("select * from a_user where id=?",[$id]);
    unset($r1['c_passwd']);
    if ($setUUID) {
      $this->app->c_uuid = $r1['c_uuid'];
      setcookie('c_uuid',$this->app->c_uuid,0,'/');
    }
    $this->app->sendOk($r1);
  }

  private function doUpdProfile($id,$v) {
    $this->db->iUpdate('a_user',$v,['id' =>$id]);
  }

  public function updProfile() {
    $f1['id'] = $this->app->requestBody('id');
    $f1['c_code'] = $this->app->requestBody('c_code');
    if (isset($f1['id']) && isset($f1['c_code'])) {
      $r1 = $this->db->iGetRow("select * from a_nonce where id=? and c_code=? and d_expire>?",[$f1['id'],$f1['c_code'],$this->app->now]);
      if (!$r1) $this->app->sendFail("Invalid OTP or expired OTP");

      $r1['c_value'] = json_decode($r1['c_value'],true);
      $this->db->iUpdate("a_user",$r1['c_value']['profile'],["id" =>$r1['c_value']['u_id']]);
      $this->getProfile($r1['c_value']['u_id'],true);
    }
    else $this->app->sendFail('Invalid of use');
  }

  // 2019-03-03
  // let update user-define-field in a_user, and call iMail.send()
  // 1st time, it will send OTP before updating
  // later if not update email, it will not send email and do update profile
  public function userNonce() {
    $f1 = $this->app->requestBodyArray;

    if ($this->app->a_user['c_email'] ==null && !isset($f1['c_email']))
      $this->app->sendFail('Email please');

    // check unq. c_email,c_username
    unset($f1['id']);
    if (isset($f1['c_email'])) {
      $r1 = $this->db->iGetRow("select * from a_user where c_email=?",[$f1['c_email']]);
      if ($r1 && $r1['id'] !=$this->app->a_user['id'])
        $this->app->sendFail('This email already bind with other user');
    }
    if (isset($f1['c_username'])) {
      $r1 = $this->db->iGetRow("select * from a_user where c_username=?",[$f1['c_username']]);
      if ($r1 && $r1['id'] !=$this->app->a_user['id'])
        $this->app->sendFail('This username already bind with other user');
    }
    if (isset($f1['c_passwd'])) $f1['c_passwd'] =$this->app->iPassword_hash($f1['c_passwd']);

    $needOtp = true;
    if ($this->app->a_user['c_email'] !=null && !isset($f1['c_email']))
      $needOtp = false;
    if (isset($f1['c_email']) && $f1['c_email'] ==$this->app->a_user['c_email'])
      $needOtp = false;

    $f2['d_expire'] = date('Y-m-d H:i:s', strtotime('+3 hour'));
    $f2['c_code']   = rand(1000,9999);
    $f2['c_value']  =[
      'u_id' => $this->app->a_user['id'],
      'otp' => $needOtp,
      'profile' => $f1
    ];
    $f2['id'] =$this->db->iInsert("a_nonce",$f2);

    if (! $needOtp) {
      $this->doUpdProfile($this->app->a_user['id'],$f2['c_value']['profile']);
      $this->getProfile();
    }
    else {
      $f1['otp'] = $f2['c_code'];
      $f1['ref_id'] = $f2['id'];
      $f3['c_email'] = (isset($f1['c_email'])) ? $f1['c_email'] :$this->app->a_user['c_email'];
      $f3['u_id'] = $this->app->a_user['id'];
      $f3['d_create'] = $this->app->now;
      $f3['c_template'] = 'upd-profile';
      $f3['c_data'] = $f1;
      $f3['id'] = $this->db->iInsert('u_mail',$f3);

      $r1 = file_get_contents("http://yourqr.today/iMail/index.php?id=".$f3['id']."&op=send");

      $this->app->sendOk(["msg"=>"Please open your email to get OTP with ref:".$f2['id'],"ref"=>$f2['id'],"mail_id"=>$f3['id']]);
    }
  }

  public function userLogin() {
    $f1['c_email'] = $this->app->requestBody('c_email');
    $f1['c_passwd'] = $this->app->requestBody('c_passwd');
    if (isset($f1['c_email']) && isset($f1['c_passwd'])) {
      $r1 = $this->db->iGetRow("select * from a_user where c_email=?",[$f1['c_email']]);
      if ($r1 && $this->app->iPassword_verify($f1['c_passwd'],$r1['c_passwd'])) {
        $this->app->c_uuid = $r1['c_uuid'];
        $this->getProfile($r1['id'],true);
      }
    }
    $this->app->sendFail('Invalid of use or Email/Password mismatch');
  }

  // generate random filename and store in a_media
  public function uploadMedia() {
    $uploaddir = self::$userDataFolder;
    $f1['u_id'] = $this->app->a_user['id'];
    $f1['c_name'] = basename($_FILES['userfile']['name']);
    do {
      $f1['c_code'] = $this->randomCode();
      $r1 = $this->db->iGetRow("select c_code from a_media where c_code=?",[$f1['c_code']]);
    } while($r1);

    $f1['id'] = $this->db->iInsert('a_media',$f1);

    $uploadfile = $uploaddir . $f1['c_code'].'-'.$f1['c_name'];

    if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
        $this->app->sendOk($f1);
    } else {
        $this->app->sendFail("upload failed");
    }
  }

  public function listMedia() {
    $r1 = $this->db->iGetRows("select * from a_media where u_id=?",[$this->app->a_user['id']]);
    $this->app->sendOk($r1);
  }

  public function isYourQRUrl($url) {
    return (strpos($url, $this->trackUrl) !== false);
  }

  public function getDataFromYourQRUrl($f1) {
    $data = $f1['c_data'];
    if($this->isYourQRUrl($data)) {
      $data = explode("?", $data)[0];
      $code = basename($data);
        $r1 = $this->db->iGetRow("select id,c_data,c_config from a_qr where c_code=?",[$code]);
        if($r1) {
          $f1['qr_id'] = $r1['id'];
          $f1['c_data'] = $r1['c_data'];
        $config = json_decode($r1['c_config'],true);
        if (isset($config['namecard'])) $f1['c_data'] .= "/".$code;
        }
    }
    return $f1;
  }

  public function stat($f1, $type) {
    // 2019-02-14 record a_stat when app call qr.info
    $f1['qr_id'] = (isset($f1['qr_id']))?$f1['qr_id']:0;
    $f1['user_id'] = $this->app->a_user['id'];
    $f1['c_type'] = (isset($type))?$type:'';
    $f1['c_location'] = $this->app->c_location;
    if(isset($f1['c_data'])) {
      $f1 = $this->getDataFromYourQRUrl($f1);
    } else {
      $f1['c_data'] = '';
    }
    $this->db->iInsert('a_stat', $f1);
    return true;
  }

  public function info($c, $is_stat=true, $is_web=false) {
    $r1 = $this->db->iGetRow("select * from a_qr where c_code=?",[$c]);
    if ($r1) {
      $r1['c_config'] = json_decode($r1['c_config']);
      if($is_stat) {
        $c_data = $this->trackUrl."/".$r1['c_code'];
        $this->stat(['qr_id' => $r1['id'], 'c_data' => $c_data], (($is_web)?'web':'info'));
      }

      $this->app->sendOk($r1);
    } else $this->app->sendFail("Record not found");
  }

  // since, we did not use JSON field type. we store JSON in text field
  // so we cannot use JSON_CONTAINS() that introduce in mysql 5.7
  public function reverseContact() {
    $f1 = $this->app->requestBodyArray;
    if (!is_array($f1)) $this->app->sendFail("Invalid of use");

    $res = [];
    foreach ($f1 as $f) {
      $f = intval($f);
      $r1 = $this->db->iGetRow("select * from a_qr where c_config like '%$f%'");

      // you may add more filter here.
      if ($r1) {
        $r1['c_config'] = json_decode($r1['c_config'],true);
        if ($r1['c_config']['namecard']['telephone'] !=$f) $r1 = false;
      }
      $res[] = ["phone" =>$f,"data" => $r1];
    }
    $this->app->sendOk($res);
  }

  public function myQR() {
    $start = isset($_GET['start']) ? $_GET['start'] : 0;
    $rows  = isset($_GET['rows']) ? $_GET['rows'] : 30;

    $sql =<<<EOT
select q.*, count(s.id), max(s.d_seen)
  from a_qr q
  left join a_stat s on (s.qr_id =q.id)
  where q.u_id=?
  group by q.id
  limit $start,$rows
EOT;

    $r1 =$this->db->iGetRows($sql,[$this->app->a_user['id']]);
    foreach ($r1 as $k1 =>$v1) {
      $r1[$k1]['c_data'] = json_decode($v1['c_data']);
      $r1[$k1]['c_config'] = json_decode($v1['c_config']);

      // any data you want add here
    }
    $this->app->sendOk($r1);
  }


  public function getCookie() {
    $this->app->sendOk($_COOKIE);
  }

  public function  checkQR($c) {
    $r1 = $this->db->iGetRows("
    SELECT date(`d_seen`) as d,count(a_stat.id) as c FROM `a_stat` join a_user WHERE a_stat.user_id = a_user.id AND a_stat.qr_id = ? AND platform NOT Like '%unk%' AND (c_type = 'go' OR c_type ='scan') group by date(a_stat.d_seen)
    ",[$c]);
    $this->app->sendOk($r1);
  }

  public function track() {
    $f1 = $this->app->requestBodyArray;
    $this->stat($f1, 'track');
    //$this->statCoupon('scan'); // BILL
    $this->app->sendOk(true);
  }

  public function log() {
    $this->app->insertUsageLog("debug");
  }

  public function forgotPassword() {
    $c_email = $this->app->requestBody('c_email');
    $r1 =$this->db->iGetRow("select * from a_user where c_email=?",[$c_email]);
    if (!$r1) $this->app->sendFail("Email not found");

    $f2['d_expire'] = date('Y-m-d H:i:s', strtotime('+3 hour'));
    $f2['c_code']   = rand(1000,9999);
    $f1['_otp']     = $f2['c_code'];
    $f1['c_passwd'] = $this->app->iPassword_hash($f1['_otp']);

    $f2['c_value']  =[
      'u_id' => $r1['id'],
      'otp' => true,
      'profile' => $f1
    ];
    $f2['id'] =$this->db->iInsert("a_nonce",$f2);

    $f1['ref_id']   = $f2['id'];

    $f3['c_email'] = $r1['c_email'];
    $f3['u_id'] = $r1['id'];
    $f3['d_create'] = $this->app->now;
    $f3['c_template'] = 'reset-password';
    $f3['c_data'] = $f1;
    $f3['id'] = $this->db->iInsert('u_mail',$f3);

    $r1 = file_get_contents("http://yourqr.today/iMail/index.php?id=".$f3['id']."&op=send");

    $this->app->sendOk(["msg"=>"Please open your email to get OTP with ref:".$f2['id'],"ref"=>$f2['id'],"mail_id"=>$f3['id']]);
  }

  // Bill 29/4/62 Coupon features
  public function getUserCoupon() {
    $r1 = $this->db->iGetRows("select d.d_create, d.c_type, d.d_start, d.d_expire, d.i_count, c.* from a_coupon_distribute d
                                left join a_coupon_activate a on (a.distribute_id =d.id and a.user_id =d.user_id) 
                                left join a_coupon c on (c.coupon_id =d.id) 
                                where user_id=? ORDER BY d.d_create", [$this->app->a_user['id']]);
    $this->app->sendOk($r1);
  }
  public function getCoupon($id=0) {
    $r1 = $this->db->iGetRow("select d.d_create, d.c_type, d.d_start, d.d_expire, d.i_count, c.* from a_coupon_distribute d
                              left join a_coupon_activate a on (a.distribute_id =d.id and a.user_id =d.user_id) 
                              left join a_coupon c on (c.coupon_id =d.id) 
                              where id=?", [$id]);
    return $r1;
  }
  public function redeemCoupon($id=0) {
    $r1 = $this->db->iGetRow("select * from a_coupon_distribute where id=? and user_id=? and d_expire>?", [$id, $this->app->a_user['id'], $this->app->now]);

    if($r1) {
      $f1['distribute_id'] = $r1['id'];
      $f1['user_id'] = $this->app->a_user['id'];
      $f1['c_location'] = $this->app->c_location;
      $f1['i_count'] = $r1['i_count'];
      $this->db->iInsert('a_coupon_activate', $f1);
      $this->app->sendOk(["msg"=>"Redeem complete","ref"=>$r1['id']]);
    }
    $this->app->sendFail("Invalid coupon");
  }
  public function getRandomCoupon() {
    $r1 = $this->db->iGetRow("select * from a_coupon where e_status='active' ORDER BY RAND() LIMIT 1");
    return $r1;
  }
  public function distributeCoupon($coupon, $type) {
    $coupon['i_distribute_count'] = $coupon['i_distribute_count']+1;
    $this->db->iUpdate('a_coupon', $coupon, ['id' => $coupon['id']]);

    $f1['coupon_id'] = $coupon['id'];
    $f1['user_id'] = $this->app->a_user['id'];
    $f1['c_type'] = $type;
    $f1['d_start'] = $this->app->now;
    $f1['d_expire'] = '2019-07-31 00:00:00';
    $f1['i_count'] = $coupon['i_distribute_count'];
    $this->db->iInsert('a_coupon_distribute', $f1);
    $this->stat([], 'distribute_coupon');
  }

  public function coupon_profile($user) {
    if(!isset($user['c_data']->profile)) {
      $coupon = $this->getRandomCoupon();
      $this->distributeCoupon($coupon, 'profile');
      $user['c_data']->profile = true;
      $this->db->iUpdate("a_user",['c_data' => json_encode($user['c_data'])],["id" =>$user['id']]);
    }
    return $user;
  }

  public function coupon_scan($user) {
    $count = 1;
    if(isset($user['c_data']->scan_count)) {
      $count = $user['c_data']->scan_count = $user['c_data']->scan_count + 1;
    }

    if($count == 1 && ($count % 5 == 0) && !isset($user['c_data']->{'scan_'.$count})) {
      $coupon = $this->getRandomCoupon();
      $this->distributeCoupon($coupon, 'scan_'.$count);
      $user['c_data']->{'scan_'.$count} = true;
    }
    $this->db->iUpdate("a_user",['c_data' => json_encode($user['c_data'])],["id" =>$user['id']]);
    return $user;
  }

  public function statCoupon($type) {
    /*$user = $this->app->a_user;
    if ($user) {
      if(!$user['c_data']) $user['c_data'] = [];
      else $user['c_data'] = json_decode($user['c_data']); 
      $user = $this->{'coupon_'.$type}($user);
    }*/
    return true;
  }
  // END BILL 29/4/62 Coupon features
}
