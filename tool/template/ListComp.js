{%- if ifs is defined  -%}

{{ iter }}.filter(function({{ target }}){
	return {{ ifs }};
}).map(function({{ target }}){
	return {{ elt }};
})

{%- else -%}

{{ iter }}.map(function({{ target }}){
	return {{ elt }};
})

{%- endif %}