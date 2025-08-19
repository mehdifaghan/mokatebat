<?php
// Simple cPanel-friendly RSVP handler
// - Appends submissions to data/rsvps.csv
// - Optionally emails the submission if MAIL_TO is set

// CONFIG
$MAIL_TO = getenv('MAIL_TO') ?: '';
$MAIL_SUBJECT = 'RSVP جدید - دعوتنامه عروسی';
$CSV_PATH = __DIR__ . '/data/rsvps.csv';

function sanitize($value) {
  return trim(filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
}

function ensureCsvExists($path) {
  if (!file_exists($path)) {
    $dir = dirname($path);
    if (!is_dir($dir)) { mkdir($dir, 0775, true); }
    $header = "datetime,full_name,phone,guests,status,message\n";
    file_put_contents($path, $header);
    @chmod($path, 0664);
  }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo '<meta charset="utf-8"><div style="font-family: Vazirmatn, sans-serif; text-align:center; padding:40px;">متد نامعتبر</div>';
  exit;
}

$full_name = sanitize($_POST['full_name'] ?? '');
$phone     = sanitize($_POST['phone'] ?? '');
$guests    = intval($_POST['guests'] ?? 1);
$status    = sanitize($_POST['status'] ?? '');
$message   = sanitize($_POST['message'] ?? '');

if ($full_name === '' || $phone === '' || $guests < 1 || $status === '') {
  http_response_code(400);
  echo '<meta charset="utf-8"><div style="font-family: Vazirmatn, sans-serif; text-align:center; padding:40px;">لطفاً همه فیلدهای ضروری را تکمیل کنید.</div>';
  exit;
}

// Save to CSV
ensureCsvExists($CSV_PATH);
$row = [
  date('Y-m-d H:i:s'),
  $full_name,
  $phone,
  $guests,
  $status,
  str_replace(["\r","\n"], [' ',' '], $message)
];
$fp = fopen($CSV_PATH, 'a');
fputcsv($fp, $row);
fclose($fp);

// Optional email
if ($MAIL_TO) {
  $body = "نام: $full_name\n" .
          "تلفن: $phone\n" .
          "تعداد: $guests\n" .
          "وضعیت: $status\n" .
          "پیام: $message\n" .
          "زمان: " . date('Y-m-d H:i:s') . "\n";
  @mail($MAIL_TO, $MAIL_SUBJECT, $body, 'Content-Type: text/plain; charset=UTF-8');
}

// Thank you page
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ثبت شد | دعوتنامه</title>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
  <meta http-equiv="refresh" content="6; url=index.html#rsvp">
  <style>
    body{font-family:'Vazirmatn',sans-serif;background:#fff7fb}
  </style>
  <script>
    setTimeout(function(){ window.location.href='index.html#rsvp'; }, 6000);
  </script>
  <link rel="icon" href="assets/img/ornament.svg" type="image/svg+xml">
  <meta name="robots" content="noindex">
</head>
<body class="d-flex align-items-center justify-content-center" style="min-height:100vh;">
  <div class="text-center p-4">
    <div class="display-6 mb-2">با تشکر از شما</div>
    <p class="text-muted mb-4">فرم شما با موفقیت ثبت شد.</p>
    <a href="index.html#rsvp" class="btn btn-primary">بازگشت</a>
    <div class="small text-muted mt-3">در حال انتقال خودکار...</div>
  </div>
</body>
</html>

