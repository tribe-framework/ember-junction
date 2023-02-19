<?php
$types = json_decode(file_get_contents('../../config/types.json'), true);

$commands = "rm app/models -R; ";
$commands = "rm tests/unit/models -R; ";
$commands = "mkdir app/models; ";

foreach (array_keys($types) as $type) {
	$commands .= "echo \"import Model, { attr } from '@ember-data/model'; export default class ".ucfirst($type)."Model extends Model { @attr('tribe-modules') modules; }\" >> app/models/".$type.".js; ";
}

exec($commands);
?>