# -*- coding: utf-8 -*-
"""
Created on Tue May  3 00:37:40 2016

@author: yiyuezhuo
"""



def erfs(x):
    # erf(x/sqrt(2))
    b=[0,0.196854,0.115194,0.000344,0.019527]
    return 1-(1+sum([b[i]*x**i for i in range(1,5)]))**(-4)

def erf_cdf(x):
    return 0.5*(1+erfs(np.abs(x))*np.sign(x))

norms_cdf=erf_cdf

def star_ppf(p,func):
    try:
        if 0<p<0.5:
            return -func(p)
        elif p==0:
            return 0.5
        else:
            return func(1-p)
    except ValueError:
        return [star_ppf(pi,func) for pi in p]


def Shannei(a):
    y=-np.log(4*a*(1-a))
    b=5.7262204
    c=11.640595
    d=2.0611786
    return np.sqrt(y*(d-b/(y+c)))

norms_ppf=lambda a:star_ppf(a,Shannei)

def norm_cdf(x,mu,sigma):
    return norms_cdf((x-mu)/sigma)

def norm_ppf(a,mu,sigma):
    return sigma*norms_ppf+mu

def Nemes_gamma(x):
    return np.sqrt(2*np.pi/x)*((1/np.e)*(x+1/(12*x-1/(10*x))))**x

def Nemes_beta(a,b):
    return Nemes_gamma(a)*Nemes_gamma(b)/Nemes_gamma(a+b)

gamma=Nemes_gamma
beta=Nemes_beta

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

def chi2_f(x,n):
    return (1/(2*gamma(n/2)))*(x/2)**(n/2-1)*np.exp(-x/2)

def chi2_cdf(x,n):
    if n>100:
        return norms_cdf((x-n)/np.sqrt(2*n))
    elif n==1:
        return 2*norms_cdf(np.sqrt(x))-1
    elif n==2:
        return 1-np.exp(-x/2)
    else:
        return chi2_cdf(x,n-2)-2*chi2_f(x,n)

def chi2_ppf(p,n):
    if n==1:
        pstar=(p+1)/2
        return norms_ppf(pstar)**2
    elif n==2:
        return -2*np.log(1-p)
    elif n<30:
        return n*(1-2/(9*n)+norms_ppf(p)*np.sqrt(2/(9*n)))**3
    else:
        return (1/2)*(norms_ppf(p)+np.sqrt(2*n-1))**2

def t_cdf(t,n):
    x=n/(n+t**2)
    if t==0:
        return 0.5
    elif t>0:
        return 1-0.5*beta_cdf(x,n/2,1/2)
    else:
        return 0.5*beta_cdf(x,n/2,1/2)

def t_ppf(p,n):
    pstar=2*p if p<1/2 else 2*(1-p)
    return np.sign(p-1/2)*np.sqrt((n/(beta_ppf(pstar,n/2,1/2)))-n)
    
def F_cdf(x,m,n):
    y=(m*x)/(n+m*x)
    return beta_cdf(y,m/2,n/2)

def F_ppf(p,m,n):
    top=n*beta_ppf(p,m/2,n/2)
    bottom=m*(1-beta_ppf(p,m/2,n/2))
    return top/bottom