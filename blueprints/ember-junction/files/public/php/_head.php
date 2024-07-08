<?php
//Website's title, description, twitter handle and cover image link
$meta_title = "Junction";
$meta_description = "Frame your data.";
$meta_image_url = "";
$twitter_handle = "";
?>

<title><?=$meta_title?></title>
<meta name="description" content="<?=$meta_description?>">

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@<?=$twitter_handle?>" />
<meta name="twitter:creator" content="@<?=$twitter_handle?>" />

<meta property="og:title" content="<?=$meta_title?>">
<meta property="og:description" content="<?=$meta_description?>">

<meta property="og:image" content="<?=$meta_image_url?>">
<meta name="junction/config/environment" content="%7B%22modulePrefix%22%3A%22junction%22%2C%22environment%22%3A%22production%22%2C%22rootURL%22%3A%22%2F%22%2C%22locationType%22%3A%22history%22%2C%22EmberENV%22%3A%7B%22EXTEND_PROTOTYPES%22%3Afalse%2C%22FEATURES%22%3A%7B%7D%2C%22_APPLICATION_TEMPLATE_WRAPPER%22%3Afalse%2C%22_DEFAULT_ASYNC_OBSERVERS%22%3Atrue%2C%22_JQUERY_INTEGRATION%22%3Afalse%2C%22_NO_IMPLICIT_ROUTE_MODEL%22%3Atrue%2C%22_TEMPLATE_ONLY_GLIMMER_COMPONENTS%22%3Atrue%7D%2C%22APP%22%3A%7B%22name%22%3A%22junction%22%2C%22version%22%3A%220.0.0%2Bce96e795%22%7D%2C%22JUNCTION_PASSWORD%22%3A%22<?php echo urlencode($_ENV['JUNCTION_PASSWORD']); ?>%22%2C%22PLAUSIBLE_AUTH%22%3A%22%22%2C%22PLAUSIBLE_DOMAIN%22%3A%22%22%2C%22PUSHER_API_KEY%22%3A%22%22%2C%22PUSHER_CLUSTER%22%3A%22ap2%22%2C%22TribeENV%22%3A%7B%22API_URL%22%3A%22<?php echo urlencode($_ENV['WEB_URL']); ?>%22%7D%7D" />