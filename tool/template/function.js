function {{ func_name }}({{ args_s }},{{ kwargs_s }}){
	var {{ arg_name_list|join(',') }};
	
	{% for arg in arg_name_list -%}
	{{ arg }}={{ kwargs_s }}.{{ arg }};
	{% endfor %}
	{% for arg in arg_name_list -%}
	{{ arg }}={{ arg }} || {{ args_s }}[{{ loop.index0 }}];
	{% endfor %}
	{% for pair in defaultMap -%}
	{{ pair[0] }}={{ pair[0] }} || {{ pair[1] }};
	{% endfor %}
	
{{ body }}
}