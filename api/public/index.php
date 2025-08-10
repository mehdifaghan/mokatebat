<?php
// Simple PHP API (no frameworks). For demo: file-based storage in /storage
// Run with: php -S 0.0.0.0:8080 -t public

header('Content-Type: application/json; charset=utf-8');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if (isset($_SERVER['HTTP_ORIGIN'])) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
} else {
  header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$BASE_PATH = dirname(__DIR__);
$STORAGE = $BASE_PATH . '/storage';
if (!is_dir($STORAGE)) { mkdir($STORAGE, 0777, true); }

function read_json($file) {
  if (!file_exists($file)) return null;
  $raw = file_get_contents($file);
  $data = json_decode($raw, true);
  return $data;
}
function write_json($file, $data) {
  file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function json($data, $code = 200) {
  http_response_code($code);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function parse_body() {
  $raw = file_get_contents('php://input');
  if (!$raw) return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function require_auth() {
  // Demo auth by PHP session
  if (session_status() === PHP_SESSION_NONE) session_start();
  if (!isset($_SESSION['user'])) {
    json(['error' => 'unauthorized'], 401);
  }
}

function current_user() {
  if (session_status() === PHP_SESSION_NONE) session_start();
  return $_SESSION['user'] ?? null;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Mount under /api base path
$BASE_PREFIX = '/api';
if (str_starts_with($path, $BASE_PREFIX)) {
  $path = substr($path, strlen($BASE_PREFIX));
  if ($path === '') $path = '/';
}

// Seed data if not exists
$seedFiles = [
  'members.json' => [
    'items' => [
      ['id'=>1,'code'=>'M-001','fullName'=>'علی رضایی','nationalId'=>'0011111111','status'=>'فعال','phone'=>'09120000001','email'=>'ali@example.com','address'=>'تهران'],
      ['id'=>2,'code'=>'M-002','fullName'=>'زهرا محمدی','nationalId'=>'0022222222','status'=>'غیرفعال','phone'=>'09120000002','email'=>'zahra@example.com','address'=>'مشهد'],
      ['id'=>3,'code'=>'M-003','fullName'=>'مهدی حسینی','nationalId'=>'0033333333','status'=>'فعال','phone'=>'09120000003','email'=>'mehdi@example.com','address'=>'اصفهان'],
    ]
  ],
  'letters.json' => [
    'items' => [
      ['id'=>101,'subject'=>'ابلاغ جلسه','senderName'=>'مدیریت','receiverName'=>'واحد مالی','date'=>date('c', strtotime('-2 day')),'status'=>'جدید','body'=>'متن نامه جلسه...','box'=>'inbox'],
      ['id'=>102,'subject'=>'درخواست مرخصی','senderName'=>'کارمند الف','receiverName'=>'منابع انسانی','date'=>date('c', strtotime('-1 day')),'status'=>'خوانده‌شده','body'=>'متن درخواست...','box'=>'inbox'],
      ['id'=>201,'subject'=>'ارسال گزارش','senderName'=>'واحد مالی','receiverName'=>'مدیریت','date'=>date('c', strtotime('-3 day')),'status'=>'ارسال‌شده','body'=>'ضمناً گزارش پیوست شد.','box'=>'sent'],
      ['id'=>301,'subject'=>'پیش‌نویس قرارداد','senderName'=>'کاربر','receiverName'=>'—','date'=>date('c'),'updatedAt'=>date('c'),'status'=>'پیش‌نویس','body'=>'نسخه اولیه قرارداد...','box'=>'drafts'],
    ]
  ],
  'users.json' => [
    'items' => [
      ['id'=>1,'fullName'=>'مدیر سیستم','username'=>'admin','role'=>'admin'],
      ['id'=>2,'fullName'=>'کاربر عادی','username'=>'user','role'=>'user'],
    ]
  ],
  'roles.json' => [ 'items' => [['name'=>'admin'], ['name'=>'manager'], ['name'=>'user']] ],
  'org.json' => [
    'root' => [
      'title' => 'مدیریت عامل',
      'children' => [
        [ 'title' => 'منابع انسانی' ],
        [ 'title' => 'مالی', 'children' => [ ['title'=>'حسابداری'], ['title'=>'بودجه'] ] ],
        [ 'title' => 'فناوری اطلاعات' ],
      ]
    ]
  ]
];
foreach ($seedFiles as $file => $data) {
  $full = "$STORAGE/$file";
  if (!file_exists($full)) write_json($full, $data);
}

// Routing
if ($path === '/auth/me' && $method === 'GET') {
  $user = current_user();
  json(['user' => $user]);
}
if ($path === '/auth/login' && $method === 'POST') {
  if (session_status() === PHP_SESSION_NONE) session_start();
  $body = parse_body();
  $username = $body['username'] ?? '';
  $password = $body['password'] ?? '';
  // Demo: accept admin/admin or user/user
  $users = read_json("$STORAGE/users.json");
  $found = null;
  foreach ($users['items'] as $u) {
    if (($username === 'admin' && $password === 'admin' && $u['username']==='admin') ||
        ($username === 'user' && $password === 'user' && $u['username']==='user')) {
      $found = $u; break;
    }
  }
  if (!$found) json(['error'=>'invalid credentials'], 401);
  $_SESSION['user'] = $found;
  json(['ok'=>true,'user'=>$found]);
}
if ($path === '/auth/logout' && $method === 'POST') {
  if (session_status() === PHP_SESSION_NONE) session_start();
  session_destroy();
  json(['ok'=>true]);
}

if ($path === '/members' && $method === 'GET') {
  require_auth();
  $q = $_GET['q'] ?? '';
  $data = read_json("$STORAGE/members.json");
  $items = $data['items'];
  if ($q) {
    $items = array_values(array_filter($items, function($m) use ($q) {
      return str_contains($m['fullName'], $q) || str_contains($m['nationalId'], $q) || str_contains($m['code'], $q);
    }));
  }
  json(['items'=>$items]);
}
if (preg_match('#^/members/(\d+)$#', $path, $m) && $method === 'GET') {
  require_auth();
  $id = intval($m[1]);
  $data = read_json("$STORAGE/members.json");
  foreach ($data['items'] as $it) if ($it['id']===$id) json($it);
  json(['error'=>'not found'], 404);
}

if ($path === '/letters' && $method === 'GET') {
  require_auth();
  $box = $_GET['box'] ?? 'inbox';
  $q = $_GET['q'] ?? '';
  $data = read_json("$STORAGE/letters.json");
  $items = array_values(array_filter($data['items'], fn($l) => ($l['box'] ?? 'inbox') === $box));
  if ($q) {
    $items = array_values(array_filter($items, function($l) use ($q) {
      return str_contains($l['subject'], $q) || str_contains($l['senderName'] ?? '', $q) || str_contains($l['receiverName'] ?? '', $q);
    }));
  }
  json(['items'=>$items]);
}
if (preg_match('#^/letters/(\d+)$#', $path, $m) && $method === 'GET') {
  require_auth();
  $id = intval($m[1]);
  $data = read_json("$STORAGE/letters.json");
  foreach ($data['items'] as $it) if ($it['id']===$id) json($it);
  json(['error'=>'not found'], 404);
}
if ($path === '/letters' && $method === 'POST') {
  require_auth();
  $body = parse_body();
  $data = read_json("$STORAGE/letters.json");
  $items = $data['items'];
  $id = 1;
  foreach ($items as $l) $id = max($id, intval($l['id'])+1);
  $now = date('c');
  $letter = [
    'id' => $id,
    'subject' => $body['subject'] ?? 'بدون موضوع',
    'senderName' => current_user()['fullName'] ?? 'کاربر',
    'receiverName' => $body['receiver'] ?? '—',
    'date' => $now,
    'updatedAt' => $now,
    'status' => ($body['type'] ?? 'draft') === 'draft' ? 'پیش‌نویس' : 'ثبت',
    'body' => $body['body'] ?? '',
    'box' => ($body['type'] ?? 'draft') === 'draft' ? 'drafts' : 'sent'
  ];
  $items[] = $letter;
  $data['items'] = $items;
  write_json("$STORAGE/letters.json", $data);
  json($letter, 201);
}

if ($path === '/users' && $method === 'GET') {
  require_auth();
  $data = read_json("$STORAGE/users.json");
  json(['items'=>$data['items']]);
}
if ($path === '/roles' && $method === 'GET') {
  require_auth();
  $data = read_json("$STORAGE/roles.json");
  json(['items'=>$data['items']]);
}
if (preg_match('#^/users/(\d+)/role$#', $path, $m) && $method === 'POST') {
  require_auth();
  $userId = intval($m[1]);
  $body = parse_body();
  $role = $body['role'] ?? null;
  if (!$role) json(['error'=>'role required'], 422);
  $users = read_json("$STORAGE/users.json");
  foreach ($users['items'] as &$u) {
    if ($u['id'] === $userId) { $u['role'] = $role; break; }
  }
  write_json("$STORAGE/users.json", $users);
  json(['ok'=>true]);
}

if ($path === '/org-structure' && $method === 'GET') {
  require_auth();
  $data = read_json("$STORAGE/org.json");
  json($data);
}

json(['error' => 'not found', 'path'=>$path], 404);