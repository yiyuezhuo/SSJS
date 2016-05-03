# -*- coding: utf-8 -*-
"""
Created on Tue May  3 00:22:57 2016

@author: yiyuezhuo
"""

import compiler

import argparse

def transform(source_path,target_path):
    with open(source_path,encoding='utf8') as f:
        python_code=f.read()
    js_code=compiler.transform(python_code)
    if target_path==None:
        target_path='.'.join(source_path.split('.')[:-1])+'.js'
    with open(target_path,'w',encoding="utf8") as f:
        f.write(js_code)
    print('succ {source} -> {target}'.format(source=source_path,target=target_path))

parser = argparse.ArgumentParser(usage=u'$ python CLI.py test2.py test2.js',
                                 description=u"Python to JavaScript compiler")
parser.add_argument('source',help=u'source python code file path')
parser.add_argument('--target',default=None,help=u'target JavaScript code file path')
args=parser.parse_args()
transform(args.source,args.target)
