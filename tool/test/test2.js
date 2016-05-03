var stat3=(function(){
    //@Author yiyuezhuo
    //include
    function _sum(l){
    	return l.reduce(function(a,b){
    		return a+b;
    	})
    };
    
    
    function _range(start,end,step){
    	var rl=[];
    	step=step || 1;
    	if (end===undefined){
    		end=start;
    		start=0;
    	}
    	if(start===end || step===0){
    		return [];
    	}
    	else if(start<end && step<0){
    		return [];
    	}
    	else if(start>end && step>0){
    		return [];
    	}
    	if (step>0){
    		for(i=start;i<end;i+=step){
    			rl.push(i);
    		}
    	}
    	else{
    		for(i=start;i>end;i+=step){
    			rl.push(i);
    		}
    	}
    	return rl;
    }
    
    function _slice(list,start,end,step){
    	// note it's not equal to range.map mode it's a bug
    	var i;
    	var rl=[];
    	var length=list.length;
    	start=start>=0 ? start : length+start;
    	end=end>=0? end : length+end;
    	step=step || 1;
    	if (end===undefined){
    		end=start;
    		start=0;
    	}
    	if(start===end || step===0){
    		return [];
    	}
    	else if(start<end && step<0){
    		return [];
    	}
    	else if(start>end && step>0){
    		return [];
    	}
    	if (step>0){
    		for(i=start;i<end;i+=step){
    			rl.push(list[i]);
    		}
    	}
    	else{
    		for(i=start;i>end;i+=step){
    			rl.push(list[i]);
    		}
    	}
    	return rl;
    }
    
    function sum(__args__,__kwargs__){
    	var l=__args__[0];
    	return _sum(l);
    }
    
    function range(__args__,__kwargs__){
    	var start=__args__[0];
    	var end=__args__[1];
    	var step=__args__[2];
    	return _range(start,end,step);
    }
    
    function slice(__args__,__kwargs__){
    	var list=__args__[0]
    	var start=__args__[1];
    	var end=__args__[2];
    	var step=__args__[3];
    	return _slice(list,start,end,step);
    }
    
    if (_range(4).slice(0,4,2).length!==2){
    	// enhance slice
    	Array.prototype.slice=function(start,end,step){
    		return _slice(this,start,end,step);
    	}
    }
    //body
    "\nCreated on Tue May  3 00:37:40 2016\n\n@author: yiyuezhuo\n"
    function erfs(__args__,__kwargs__){
        var x;
        
        x=__kwargs__.x;
        
        x=x || __args__[0];
        
        
        
        var b=[0,0.196854,0.115194,0.000344,0.019527];
        return (1-(Math.pow((1+sum([range([1,5],{}).map(function(i){
            return (b[i]*(Math.pow(x,i)));
        })],{})),(-4))));
    }
    function erf_cdf(__args__,__kwargs__){
        var x;
        
        x=__kwargs__.x;
        
        x=x || __args__[0];
        
        
        
        return (0.5*(1+(erfs([np.abs([x],{})],{})*np.sign([x],{}))));
    }
    var norms_cdf=erf_cdf;
    function star_ppf(__args__,__kwargs__){
        var p,func;
        
        p=__kwargs__.p;
        func=__kwargs__.func;
        
        p=p || __args__[0];
        func=func || __args__[1];
        
        
        
        try{
            if((0<p&&p<0.5)){ 
                return (-func([p],{}));
            }
            else{
                if((p===0.5)){ 
                    return 0;
                }
                else{
                    return func([(1-p)],{});
                }
            }
        }
        catch(e){
            return p.map(function(pi){
                return star_ppf([pi,func],{});
            });
        }
    }
    function Shannei(__args__,__kwargs__){
        var a;
        
        a=__kwargs__.a;
        
        a=a || __args__[0];
        
        
        
        var y=(-np.log([((4*a)*(1-a))],{}));
        var b=5.7262204;
        var c=11.640595;
        var d=2.0611786;
        return np.sqrt([(y*(d-(b/(y+c))))],{});
    }
    var norms_ppf=function (__args__,__kwargs__){
        var a;
        
        a=__kwargs__.a;
        
        a=a || __args__[0];
        
        
        
    return star_ppf([a,Shannei],{})
    };
    function norm_cdf(__args__,__kwargs__){
        var x,mu,sigma;
        
        x=__kwargs__.x;
        mu=__kwargs__.mu;
        sigma=__kwargs__.sigma;
        
        x=x || __args__[0];
        mu=mu || __args__[1];
        sigma=sigma || __args__[2];
        
        
        
        return norms_cdf([((x-mu)/sigma)],{});
    }
    function norm_ppf(__args__,__kwargs__){
        var a,mu,sigma;
        
        a=__kwargs__.a;
        mu=__kwargs__.mu;
        sigma=__kwargs__.sigma;
        
        a=a || __args__[0];
        mu=mu || __args__[1];
        sigma=sigma || __args__[2];
        
        
        
        return ((sigma*norms_ppf([a],{}))+mu);
    }
    function Nemes_gamma(__args__,__kwargs__){
        var x;
        
        x=__kwargs__.x;
        
        x=x || __args__[0];
        
        
        
        return (np.sqrt([((2*np.pi)/x)],{})*(Math.pow(((1/np.e)*(x+(1/((12*x)-(1/(10*x)))))),x)));
    }
    function Nemes_beta(__args__,__kwargs__){
        var a,b;
        
        a=__kwargs__.a;
        b=__kwargs__.b;
        
        a=a || __args__[0];
        b=b || __args__[1];
        
        
        
        return ((Nemes_gamma([a],{})*Nemes_gamma([b],{}))/Nemes_gamma([(a+b)],{}));
    }
    var gamma=Nemes_gamma;
    var beta=Nemes_beta;
    function getc(__args__,__kwargs__){
        var n,x,a,b;
        
        n=__kwargs__.n;
        x=__kwargs__.x;
        a=__kwargs__.a;
        b=__kwargs__.b;
        
        n=n || __args__[0];
        x=x || __args__[1];
        a=a || __args__[2];
        b=b || __args__[3];
        
        
        
        if((n===0)){ 
            return 1;
        }
        else{
            if(((n%2)===0)){ 
                var k=(n/2);
                return (((k*(b-k))*x)/(((a+(2*k))-1)*(a+(2*k))));
            }
            else{
                if(((n%2)===1)){ 
                    var k=((n-1)/2);
                    return ((-(((a+k)*((a+b)+k))*x))/((a+(2*k))*((a+(2*k))+1)));
                }
            }
        }
    }
    function cfrac(__args__,__kwargs__){
        var tl;
        
        tl=__kwargs__.tl;
        
        tl=tl || __args__[0];
        
        
        
        if((len([tl],{})===1)){ 
            return tl[0];
        }
        else{
            return (tl[0]/(1+cfrac([tl.slice(1,undefined,undefined)],{})));
        }
    }
    function I(__args__,__kwargs__){
        var x,a,b,n,roll;
        
        x=__kwargs__.x;
        a=__kwargs__.a;
        b=__kwargs__.b;
        n=__kwargs__.n;
        roll=__kwargs__.roll;
        
        x=x || __args__[0];
        a=a || __args__[1];
        b=b || __args__[2];
        n=n || __args__[3];
        roll=roll || __args__[4];
        
        roll=roll || true;
        n=n || 100;
        
        
        if(roll&&(x>=((a-1)/((a+b)-2)))){ 
            return (1-I([(1-x),b,a,n],{"roll":false}));
        }
        var left=(((gamma([(a+b)],{})*(Math.pow(x,a)))*(Math.pow((1-x),b)))/(gamma([(a+1)],{})*gamma([b],{})));
        var right=cfrac([range([(n+1)],{}).map(function(i){
            return getc([i,x,a,b],{});
        })],{});
        return (left*right);
    }
    function U(__args__,__kwargs__){
        var x,a,b;
        
        x=__kwargs__.x;
        a=__kwargs__.a;
        b=__kwargs__.b;
        
        x=x || __args__[0];
        a=a || __args__[1];
        b=b || __args__[2];
        
        
        
        return (((1/beta([a,b],{}))*(Math.pow(x,a)))*(Math.pow((1-x),b)));
    }
    function I3(__args__,__kwargs__){
        var x,a,b;
        
        x=__kwargs__.x;
        a=__kwargs__.a;
        b=__kwargs__.b;
        
        x=x || __args__[0];
        a=a || __args__[1];
        b=b || __args__[2];
        
        
        
        if((a===(1/2))&&(b===(1/2))){ 
            return (1-((2/np.pi)*np.arctan([np.sqrt([((1-x)/x)],{})],{})));
        }
        else{
            if((a===(1/2))&&(b===1)){ 
                return np.sqrt([x],{});
            }
            else{
                if((a===1)&&(b===(1/2))){ 
                    return (1-np.sqrt([(1-x)],{}));
                }
                else{
                    if((a===1)&&(b===1)){ 
                        return x;
                    }
                    else{
                        if((a>1)){ 
                            return (I3([x,(a-1),b],{})-((1/(a-1))*U([x,(a-1),b],{})));
                        }
                        else{
                            if((b>1)){ 
                                return (I3([x,a,(b-1)],{})+((1/(b-1))*U([x,a,(b-1)],{})));
                            }
                            else{
                                throw Exception(["number vaild?"],{});
                            }
                        }
                    }
                }
            }
        }
    }
    function beta_cdf(__args__,__kwargs__){
        var x,a,b;
        
        x=__kwargs__.x;
        a=__kwargs__.a;
        b=__kwargs__.b;
        
        x=x || __args__[0];
        a=a || __args__[1];
        b=b || __args__[2];
        
        
        
        if(((a%(1/2))===0)&&((b%(1/2))===0)){ 
            return I3([x,a,b],{});
        }
        else{
            return I([x,a,b],{});
        }
    }
    function two_div(__args__,__kwargs__){
        var f,a,b,epsilon;
        
        f=__kwargs__.f;
        a=__kwargs__.a;
        b=__kwargs__.b;
        epsilon=__kwargs__.epsilon;
        
        f=f || __args__[0];
        a=a || __args__[1];
        b=b || __args__[2];
        epsilon=epsilon || __args__[3];
        
        epsilon=epsilon || 0.0001;
        
        
        while(true){
            var test=((a+b)/2);
            if(((b-a)<epsilon)){ 
                return test;
            }
            if((f([test],{})===0)){ 
                return test;
            }
            else{
                if((f([test],{})>0)){ 
                    !function(){
                        a=arguments[0];
                        b=arguments[1];
                    }(a,test);
                }
                else{
                    !function(){
                        a=arguments[0];
                        b=arguments[1];
                    }(test,b);
                }
            }
        }
    }
    function beta_ppf(__args__,__kwargs__){
        var p,a,b;
        
        p=__kwargs__.p;
        a=__kwargs__.a;
        b=__kwargs__.b;
        
        p=p || __args__[0];
        a=a || __args__[1];
        b=b || __args__[2];
        
        
        
        return two_div([function (__args__,__kwargs__){
            var x;
            
            x=__kwargs__.x;
            
            x=x || __args__[0];
            
            
            
        return (beta_cdf([x,a,b],{})-p)
        },0,1],{});
    }
    function chi2_f(__args__,__kwargs__){
        var x,n;
        
        x=__kwargs__.x;
        n=__kwargs__.n;
        
        x=x || __args__[0];
        n=n || __args__[1];
        
        
        
        return (((1/(2*gamma([(n/2)],{})))*(Math.pow((x/2),((n/2)-1))))*np.exp([((-x)/2)],{}));
    }
    function chi2_cdf(__args__,__kwargs__){
        var x,n;
        
        x=__kwargs__.x;
        n=__kwargs__.n;
        
        x=x || __args__[0];
        n=n || __args__[1];
        
        
        
        if((n>100)){ 
            return norms_cdf([((x-n)/np.sqrt([(2*n)],{}))],{});
        }
        else{
            if((n===1)){ 
                return ((2*norms_cdf([np.sqrt([x],{})],{}))-1);
            }
            else{
                if((n===2)){ 
                    return (1-np.exp([((-x)/2)],{}));
                }
                else{
                    return (chi2_cdf([x,(n-2)],{})-(2*chi2_f([x,n],{})));
                }
            }
        }
    }
    function chi2_ppf(__args__,__kwargs__){
        var p,n;
        
        p=__kwargs__.p;
        n=__kwargs__.n;
        
        p=p || __args__[0];
        n=n || __args__[1];
        
        
        
        if((n===1)){ 
            var pstar=((p+1)/2);
            return (Math.pow(norms_ppf([pstar],{}),2));
        }
        else{
            if((n===2)){ 
                return ((-2)*np.log([(1-p)],{}));
            }
            else{
                if((n<30)){ 
                    return (n*(Math.pow(((1-(2/(9*n)))+(norms_ppf([p],{})*np.sqrt([(2/(9*n))],{}))),3)));
                }
                else{
                    return ((1/2)*(Math.pow((norms_ppf([p],{})+np.sqrt([((2*n)-1)],{})),2)));
                }
            }
        }
    }
    function t_cdf(__args__,__kwargs__){
        var t,n;
        
        t=__kwargs__.t;
        n=__kwargs__.n;
        
        t=t || __args__[0];
        n=n || __args__[1];
        
        
        
        var x=(n/(n+(Math.pow(t,2))));
        if((t===0)){ 
            return 0.5;
        }
        else{
            if((t>0)){ 
                return (1-(0.5*beta_cdf([x,(n/2),(1/2)],{})));
            }
            else{
                return (0.5*beta_cdf([x,(n/2),(1/2)],{}));
            }
        }
    }
    function t_ppf(__args__,__kwargs__){
        var p,n;
        
        p=__kwargs__.p;
        n=__kwargs__.n;
        
        p=p || __args__[0];
        n=n || __args__[1];
        
        
        
        var pstar=(p<(1/2)) ? (2*p) : (2*(1-p));
        return (np.sign([(p-(1/2))],{})*np.sqrt([((n/beta_ppf([pstar,(n/2),(1/2)],{}))-n)],{}));
    }
    function F_cdf(__args__,__kwargs__){
        var x,m,n;
        
        x=__kwargs__.x;
        m=__kwargs__.m;
        n=__kwargs__.n;
        
        x=x || __args__[0];
        m=m || __args__[1];
        n=n || __args__[2];
        
        
        
        var y=((m*x)/(n+(m*x)));
        return beta_cdf([y,(m/2),(n/2)],{});
    }
    function F_ppf(__args__,__kwargs__){
        var p,m,n;
        
        p=__kwargs__.p;
        m=__kwargs__.m;
        n=__kwargs__.n;
        
        p=p || __args__[0];
        m=m || __args__[1];
        n=n || __args__[2];
        
        
        
        var top=(n*beta_ppf([p,(m/2),(n/2)],{}));
        var bottom=(m*(1-beta_ppf([p,(m/2),(n/2)],{})));
        return (top/bottom);
    }
    return {norms_cdf:function(){
        return norms_cdf(arguments,{});
    },norms_ppf:function(){
        return norms_ppf(arguments,{});
    },norm_cdf:function(){
        return norm_cdf(arguments,{});
    },norm_ppf:function(){
        return norm_ppf(arguments,{});
    },beta_cdf:function(){
        return beta_cdf(arguments,{});
    },beta_ppf:function(){
        return beta_ppf(arguments,{});
    },chi2_cdf:function(){
        return chi2_cdf(arguments,{});
    },chi2_ppf:function(){
        return chi2_ppf(arguments,{});
    },t_cdf:function(){
        return t_cdf(arguments,{});
    },t_ppf:function(){
        return t_ppf(arguments,{});
    },F_cdf:function(){
        return F_cdf(arguments,{});
    },F_ppf:function(){
        return F_ppf(arguments,{});
    },}
})();