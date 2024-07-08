<?php
require __DIR__ . '/../../../_init.php';
$types = json_decode(file_get_contents($_ENV['DOCKER_INTERNAL_TRIBE_URL'].'/api.php/webapp/0'), true)['data']['attributes']['modules'];
$models = '';
foreach (array_keys($types) as $type) {
        $type_hyphen = str_replace('_', '-', $type);
        $type_ucwords = str_replace(' ', '', ucwords(str_replace('_', ' ', $type)));
        $models .= 'define("junction/models/'.$type_hyphen.'",["exports","@ember-data/model"],(function(e,t){var n,r,i
function l(e,t,n,r){n&&Object.defineProperty(e,t,{enumerable:n.enumerable,configurable:n.configurable,writable:n.writable,value:n.initializer?n.initializer.call(r):void 0})}function o(e,t,n,r,i){var l={}
return Object.keys(r).forEach((function(e){l[e]=r[e]})),l.enumerable=!!l.enumerable,l.configurable=!!l.configurable,("value"in l||l.initializer)&&(l.writable=!0),l=n.slice().reverse().reduce((function(n,r){return r(e,t,n)||n}),l),i&&void 0!==l.initializer&&(l.value=l.initializer?l.initializer.call(i):void 0,l.initializer=void 0),void 0===l.initializer&&(Object.defineProperty(e,t,l),l=null),l}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(n=class extends t.default{constructor(...e){super(...e),l(this,"slug",r,this),l(this,"modules",i,this)}},r=o(n.prototype,"slug",[t.attr],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),i=o(n.prototype,"modules",[t.attr],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),n)}))
';
}
?>
"use strict"
<?php echo $models; ?>