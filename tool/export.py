# -*- coding: utf-8 -*-
"""
Created on Tue May  3 09:59:51 2016

@author: yiyuezhuo
"""

import json
import compiler
import ast

from compiler import load_template,tab

module_template=load_template('template/module.js')


def output(config,content):
    source=config['source']
    target=config.get('target','.'.join(source.split('.')[:-1])+'.js')
    with open(target,'w',encoding='utf8') as f:
        f.write(content)
    print('succ {source} -> {target}'.format(source=source,target=target))
    

def makejson(config):
    #config=json.load('make_path')
    with open(config['source'],encoding='utf8') as f:
        python_code=f.read()
    tree=ast.parse(python_code)
    
    js_code_body=compiler.parse(tree)
    
    # import include code
    if 'include' in config:
        js_code_head_list=[]
        include=config['include'] if type(config['include'])==list else [config['include']]
        for _include in include:
            with open(_include,encoding="utf8") as f:
                js_code_head_list.append(f.read())
        js_code_head='\n'.join(js_code_head_list)
    else:
        js_code_head=''
    
    # direct export
    if 'module_name' not in config:
        return output(config,js_code_head+'\n'+js_code_body)
        
    #module export
    module_name=config['module_name']
    exports=config['export']
    comment=config.get('comment','')
    content=module_template.render(js_code_head=tab(js_code_head),
                                   js_code_body=tab(js_code_body),
                                   module_name=module_name,
                                   exports=exports,
                                   comment=comment)
    return output(config,content)
    
def make(make_path):
    with open(make_path,encoding='utf8') as f:
        config=json.load(f)
    makejson(config)
    

if __name__=='__main__':
    make('test/make.json')

    