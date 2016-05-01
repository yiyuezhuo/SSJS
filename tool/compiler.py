# -*- coding: utf-8 -*-
"""
Created on Sat Apr 30 11:25:03 2016

@author: yiyuezhuo
"""

import jinja2
import ast

'''
with open('function.js','r',encoding='utf8') as f:
    function_template=jinja2.Template(f.read())
'''
def load_template(fname,tabMap='    '):
    with open(fname,'r',encoding='utf8') as f:
        s=f.read()
    return jinja2.Template(s.replace('\t',tabMap))
    
function_template=load_template('function.js')
list_compre_template=load_template('ListComp.js')
    

def tab(doc,head='    '):
    return '\n'.join([head+s for s in doc.split('\n')])

def find_free_name(root,usedSet):
    if root not in usedSet:
        return root
    else:
        return find_free_name('_'+root,usedSet)

def parseName(node):
    return node.id

def parseNum(node):
    return node.n
    
def parseBinOp(node):
    left=parse(node.left)
    right=parse(node.right)
    op=type(node.op)
    opMapping={ast.Mult:'*',ast.Add:'+',ast.Sub:'-',ast.Div:'/',ast.Mod:'%'}
    if op in opMapping.keys():
        return '({}{}{})'.format(left,opMapping[op],right)
    elif op==ast.Pow:
        return '(Math.pow({},{}))'.format(left,right)
    else:
        raise NotImplemented # eg:**
        
def parseBoolOp(node):
    left=parse(node.values[0])
    right=parse(node.values[1])
    mapping={ast.And:'&&',ast.Or:'||'}
    op=mapping[type(node.op)]
    return '{left}{op}{right}'.format(left=left,op=op,right=right)
    
        
def parseUnaryOp(node):
    operand=parse(node.operand)
    op=type(node.op)
    opMapping={ast.USub:'-'}
    if op in opMapping.keys():
        return '({}{})'.format(opMapping[op],operand)
    else:
        raise NotImplemented
        
def parseAttribute(node):
    value=parse(node.value)
    attr=node.attr
    return '{}.{}'.format(value,attr)
    
def parse_keyword(node):
    return 
    
def parseCall(node):
    func_name=parse(node.func)
    args=','.join([str(parse(arg)) for arg in node.args])
    __args__='[{}]'.format(args)
    keywords=['"{}":{}'.format(k.arg,parse(k.value)) for k in node.keywords]
    __kwargs__='{{{}}}'.format(','.join(keywords))
    return '{func_name}({args},{kwargs})'.format(func_name=func_name,args=__args__,kwargs=__kwargs__)
    
def parseReturn(node):
    #col_offset=node.col_offset
    value=parse(node.value)
    return 'return {};'.format(value)
    
def parseAssign(node):
    #col_offset=node.col_offset
    #TODO not implement multi assign 
    targets=','.join([parse(target) for target in node.targets])
    value=parse(node.value)
    return 'var {}={};'.format(targets,value)
    
def parseBlock(nodeList):
    '''helper method'''
    return '\n'.join([parse(line) for line in nodeList])
    
def parse_arg(node):
    return node.arg
    
def parse_arguments(node):
    return ','.join([parse_arg(nod) for nod in node.args])
    
def parseFunctionDef(node):
    '''
    def f(a,b,c=2):
        dosomething...
        
    ->
    
    function f(__args__,__kwarg__){
        var a,b,c;
        
        a=__kwargs__.a;
        b=__kwargs__.b;
        c=__kwargs__.c
        
        a=a || __args__[0];
        b=b || __args__[1];
        c=c || __args__[2];
        
        c=c || 2;
        
        dosomething...   
    }
    '''
    name=node.name
    arg_name=[arg.arg for arg in node.args.args]
    defaults=node.args.defaults if hasattr(node.args,'defaults') else {}
    defaultOffset=len(arg_name)-len(defaults)
    defaultMap={}
    for i,default in enumerate(defaults):
        target=arg_name[defaultOffset+i]
        value=str(parse(default))
        defaultMap[target]=value
    set_arg_name=set(arg_name)
    __args__=find_free_name('__args__',set_arg_name)
    __kwargs__=find_free_name('__kwargs__',set_arg_name)
    body=tab(parseBlock(node.body))
    #print(defaultMap)
    code=function_template.render(func_name=name,args_s=__args__,
                             kwargs_s=__kwargs__,arg_name_list=arg_name,
                             defaultMap=list(defaultMap.items()),
                             body=body)
    return code
    

'''
    name=node.name
    args=parse_arguments(node.args)
    
    #defaults=[str(parse(default)) for default in defaults]
    defaultOffset=len(args)-len(node.defaults)
    defaultsBodyList=[]
    for i,default in enumerate(node.defaults):
        target=args[defaultOffset+i]
        value=str(parse(default))
        s='{space}{target}={target} || {value}'.format(space=' '*(node.col_offset+4),target=target,value=value)
        defaultsBodyList.push(s)
    defaultsBody='\n'.join(defaultsBodyList)
    #body='\n'.join([parse(line) for line in node.body])+'\n'
    body=parseBlock(node.body)
    head='{}function {}({}){{\n'.format(' '*node.col_offset,name,args)
    footer='{}}}'.format(' '*node.col_offset)
    return '{}{}{}\n{}'.format(head,defaultsBody,body,footer)
'''
    
def parseLambda(node):
    args=parse_arguments(node.args)
    body=parse(node.body)
    return 'function({args}){{return {body};}}'.format(args=args,body=body)

    
def parseList(node):
    return '[{}]'.format(','.join([str(parse(nod)) for nod in node.elts]))
    

def parseIndex(node):
    '''a[x] <- x'''
    index=parse(node.value)
    return '{{value}}[{index}]'.format(index=index)
    
def parseSlice(node):
    '''must give range impletion'''
    lower=parse(node.lower)
    upper=parse(node.upper)
    step=parse(node.step)
    return 'range({lower},{upper},{step}).map(function(i) {{{{ return {{value}}[i]; }}}});'.format(lower=lower,upper=upper,step=step)
    
def parseSubscript(node):
    '''a[x]'''
    value=parse(node.value)
    slice_=parse(node.slice)
    return slice_.format(value=value)
    
def parse_comprehension(node):
    ''' it can't return a indepent string '''
    target=parse(node.target)
    iter_=parse(node.iter)
   # args=[parse(arg) for arg in node.args]
    
    head=iter_
    
    if len(node.ifs)==0:
        filterChain=''
    else:
        ifs='&&'.join([str(parse(if_)) for if_ in node.ifs])
        filterChain='.filter(function({target}){{{{ return {ifs}; }}}})'.format(target=target,ifs=ifs)

    mapChain='.map(function({target}){{{{ return {{elt}} }}}})'.format(target=target)
    
    code=''.join([head,filterChain,mapChain])
    return code

'''
def parseListComp(node):
    elt=parse(node.elt)
    generators=[parse_comprehension(comp) for comp in node.generators]
    #TODO I don't know how the multi generator mean. 
    generator=generators[0]
    
    return generator.format(elt=elt)
'''
def parseListComp(node):
    #list_compre_template
    elt=parse(node.elt)
    generator=node.generators[0]
    
    _node=node
    node=generator
    
    target=parse(node.target)
    iter_=parse(node.iter)
    if len(node.ifs)==0:
        ifs=None
    else:
        ifs='&&'.join([str(parse(if_)) for if_ in node.ifs])

    node=_node
    
    kwargs=dict(elt=elt,iter=iter_,target=target)
    if ifs:
        kwargs['ifs']=ifs
    return list_compre_template.render(**kwargs)

def parseNameConstant(node):
    mapping={True:'true',False:'false'}
    return mapping[node.value]
    
def parseExceptHandler(node):
    body=parseBlock(node.body)
    return body
    
def parseTry(node):
    body=parseBlock(node.body)
    handlers=[parseExceptHandler(handler) for handler in node.handlers]
    #TODO only pick first element
    handler=handlers[0]
    code='''try{{
{tryBody}
}}
catch(e){{
{catchBody}
}}'''.format(tryBody=body,catchBody=handler)
    return code
    
def parseCompare(node):
    '''Notice python support 0<x<1 compare so...'''
    left=parse(node.left)
    opMapping={ast.Lt:'<',ast.LtE:'<=',ast.Gt:'>',ast.GtE:'>=',ast.Eq:'==='}
    ops=[opMapping[type(op)] for op in node.ops]
    comparators=[parse(comp) for comp in node.comparators]
    comps=[left]+comparators
    group=[]
    for i,pair in enumerate(zip(comps[:-1],comps[1:])):
        group.append('{left}{op}{right}'.format(left=pair[0],op=ops[i],right=pair[1]))
    return '({})'.format('&&'.join(group))
    
def parseIf(node):
    test=parse(node.test)
    body=tab(parseBlock(node.body))
    if len(node.orelse)>0:
        orelse=tab(parseBlock(node.orelse))
        return '''if({test}){{ 
{body}
}}
else{{
{orelse}
}}'''.format(test=test,body=body,orelse=orelse)
    else:
        return '''if({test}){{ 
{body}
}}'''.format(test=test,body=body)
    
    
def parseModule(node):
    return parseBlock(node.body)
    
def parseNone(node):
    return 'undefined'
    
        
def parse(node):
    typeMapping={ast.Name:parseName,
                 ast.Num:parseNum,
                 ast.BinOp:parseBinOp,
                 ast.Attribute:parseAttribute,
                 ast.Call:parseCall,
                 ast.Return:parseReturn,
                 ast.Assign:parseAssign,
                 ast.arg:parse_arg,
                 ast.arguments:parse_arguments,
                 ast.FunctionDef:parseFunctionDef,
                 ast.UnaryOp:parseUnaryOp,
                 ast.List:parseList,
                 ast.Index:parseIndex,
                 ast.Subscript:parseSubscript,
                 ast.ListComp:parseListComp,
                 ast.Try:parseTry,
                 ast.If:parseIf,
                 ast.Compare:parseCompare,
                 ast.Lambda:parseLambda,
                 ast.Module:parseModule,
                 ast.NameConstant:parseNameConstant,
                 ast.Slice:parseSlice,
                 ast.BoolOp:parseBoolOp,
                 type(None):parseNone}
    return typeMapping[type(node)](node)

'''
res=ast.parse(code)
shannei=res.body[-2]
return_=shannei.body[-1]
exp=return_.value

print(parse(res))
'''
with open('test.py','rb') as f:
    code=f.read().decode('utf8')
res=ast.parse(code)