# -*- coding: utf-8 -*-
"""
Created on Sat Apr 30 20:42:44 2016

@author: yiyuezhuo
"""

def getc(n,x,a,b):
    if n==0:
        return 1
    elif n%2==0:
        k=n/2
        return (k*(b-k)*x)/((a+2*k-1)*(a+2*k))
    elif n%2==1:
        k=(n-1)/2
        return -((a+k)*(a+b+k)*x)/((a+2*k)*(a+2*k+1))
    
def cfrac(tl):
    if len(tl)==1:
        return tl[0]
    else:
        return tl[0]/(1+cfrac(tl[1:]))


def I(x,a,b,n=100,roll=True):
    if roll and x>=(a-1)/(a+b-2):
        return 1-I(1-x,b,a,n,roll=False)
    left=(gamma(a+b)*(x**a)*((1-x)**b))/(gamma(a+1)*gamma(b))
    right=cfrac([getc(i,x,a,b) for i in range(n+1)])
    #right=sum([getc(i,x,a,b) for i in range(n+1)])
    #print([getc(i,x,a,b) for i in range(n+1)])
    #print(left,right)
    return left*right

def U(x,a,b):
    return (1/beta(a,b))*(x**a)*((1-x)**b)

def I3(x,a,b):
    #这里直接返回1,1/2特殊情况的值，递归定义，用来资瓷t分布和F分布
    if a==1/2 and b==1/2:
        #print(1)
        return 1-(2/np.pi)*np.arctan(np.sqrt((1-x)/x))
    elif a==1/2 and b==1:
        #print(2)
        return np.sqrt(x)
    elif a==1 and b==1/2:
        #print(3)
        return 1-np.sqrt(1-x)
    elif a==1 and b==1:
        #print(4)
        return x
    elif a>1:
        return I3(x,a-1,b)-(1/(a-1))*U(x,a-1,b)
    elif b>1:
        return I3(x,a,b-1)+(1/(b-1))*U(x,a,b-1)
    else:
        raise Exception("number vaild?")

def beta_cdf(x,a,b):
    #print(a%(1/2),b%(1/2))
    if a%(1/2)==0 and b%(1/2)==0:
        return I3(x,a,b)
    else:
        return I(x,a,b)
    
def two_div(f,a,b,epsilon=1e-4):
    while True:
        test=(a+b)/2
        if b-a<epsilon:
            return test
        if f(test)==0:
            return test
        elif f(test)>0:
            a,b=a,test
        else:
            a,b=test,b
    
def beta_ppf(p,a,b):
    return two_div(lambda x:beta_cdf(x,a,b)-p,0,1)