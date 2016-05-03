var {{ module_name }}=(function(){
	//{{ comment }}
	//include
{{ js_code_head }}
	//body
{{js_code_body}}
	return { 
	{%- for export in exports -%} 
	{{ export }}:function(){
		return {{ export }}(arguments,{});
	},
	{%- endfor -%}
	}
})();