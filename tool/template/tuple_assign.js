!function(){
	{%- for target in targets %}
	{{ target }}=arguments[{{ loop.index0 }}];
	{%- endfor %}
}({{ value|join(',') }});