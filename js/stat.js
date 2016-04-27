/*
function Norm(mu,sigma){
	var params={mu:mu,sigma:sigma};
	var pdf=function(x){
		return (1/(Math.sqrt(2*Math.PI)*sigma))*Math.exp(-Math.pow(x-mu,2)/(2*Math.pow(sigma,2)));
	}
	var cdf=cdfFreeze(pdf);
	var ppf=ppfFreeze(cdf);
	var sf=function(x){
		return 1-cdf(x);
	}
	var isf=ppfFreeze(sf);
	var rvs=function(){
		return cdf(Math.random());
	}
	return {params:params,pdf:pdf,cdf:cdf,ppf:ppf,
				sf:sf,isf:isf,rvs:rvs};
}
*/

var CRV=(function(){
	function _CRV(pdf){
		var cdf=cdfFreeze(pdf);
		var ppf=ppfFreeze(cdf);
		var sf=function(x){
			return 1-cdf(x);
		}
		var isf=ppfFreeze(sf);
		var rvs=function(){
			return cdf(Math.random());
		}
		return {pdf:pdf,cdf:cdf,ppf:ppf,
					sf:sf,isf:isf,rvs:rvs};
	}
	
	function _CRV2(kwargs){
		var pdf=kwargs['pdf'];
		var cdf=kwargs['cdf'] || cdfFreeze(pdf);
		var ppf=kwargs['ppf'] || ppfFreeze(cdf);
		var sf=kwargs['sf'] || function(x){
			return 1-cdf(x);
		};
		var isf=kwargs['isf'] || function(x){
			return ppf(1-x);
		}
		var rvs=kwargs['rvs'] || function(){
			return cdf(Math.random());
		};
		return {pdf:pdf,cdf:cdf,ppf:ppf,
					sf:sf,isf:isf,rvs:rvs};
	}


	function coreRange(pdf){
		var left=d3.range(10).map(function(x){return -Math.pow(10,x)});
		var right=d3.range(10).map(function(x){return Math.pow(10,x)});
		var sample=left.concat([0]).concat(right);
		//console.log(sample);
		var focus=sample.map(function(d){
			return [d,pdf(d)];
		}).sort(function(a,b){
			if(a[1]<b[1]){// key function + reverse
				return 1;
			}
			else if(a[1]==b[1]){
				return 0;
			}
			else{
				return -1;
			}
		}).slice(0,5);
		//console.log(focus);
		var rangeLeft=d3.min(focus,function(x){return x[0]});
		var rangeRight=d3.max(focus,function(x){return x[0]});
		//console.log([rangeLeft,rangeRight]);
		return [rangeLeft,rangeRight];
	}

	function cdf(pdf,p){
		var range=coreRange(pdf);
		var rangeLeft=range[0];
		var rangeRight=range[1];
		var cum=0;
		d3.range(rangeLeft,rangeRight,(rangeRight-rangeLeft)/10000).forEach(function(x){
			var y=pdf(x);
			cum+=y;
			if (cum>p){
				return x;
			}
		});
	}

	function cdfFreeze(pdf,bins){
		bins=bins || 100000;
		var range=coreRange(pdf);
		var rangeLeft=range[0];
		var rangeRight=range[1];
		var cum=0;
		var step=(rangeRight-rangeLeft)/(bins-1)
		//console.log(rangeLeft,rangeRight+step,step);
		var sample=d3.range(rangeLeft,rangeRight+step,step)
		var cumList=sample.map(function(x){
			cum+=pdf(x)*step;
			return cum;
		});
		function _cdf(x){
			var i;
			if(x<sample[0]){
				return 0;
			}
			else if(x>sample[sample.length-1]){
				return 1;
			}
			else{
				//return cumList[Math.round((x-rangeLeft)/(rangeRight-rangeLeft)*(bins-1))]
				var index=(x-rangeLeft)/(rangeRight-rangeLeft)*(bins-1);
				//index-=1;
				var p=index%1;
				if(p===0){
					return cumList[index];
				}
				else{
					var y1=cumList[Math.floor(index)]*(1-p)+cumList[Math.ceil(index)]*p;
					return y1;
				}
			}
		}
		_cdf.sample=sample;
		return _cdf;
	}

	function ppfFreeze(cdf){
		function _ppf(p){
			var i;
			if(p<=0){
				return cdf.sample[0];
			}
			else if(p>=1){
				return cdf.sample[cdf.sample.length-1];
			}
			else{
				for(i=0;i<cdf.sample.length;i++){
					var x=cdf.sample[i];
					var pBig=cdf(x);
					if(pBig>p){
						var pSmall=cdf(cdf.sample[i-1]);
						var odd=(p-pSmall)/(pBig-pSmall);
						return cdf.sample[i-1]*(1-odd)+x*odd;
					}
				}
			}
		}
		return _ppf
	}
	
	return _CRV2;
	
})();

function Norm(mu,sigma){
	var pdf=function(x){
		return (1/(Math.sqrt(2*Math.PI)*sigma))*Math.exp(-Math.pow(x-mu,2)/(2*Math.pow(sigma,2)));
	}
	var crv=CRV({pdf:pdf});
	crv.params={mu:mu,sigma:sigma};
	return crv;
}

//var norms=Norm(0,1);

var norms=(function(){
	
	function pdf(x){
		return (1/(Math.sqrt(2*Math.PI)))*Math.exp(-Math.pow(x,2)/2);
	}
	
	function product(nl){
		nl.reduce(function(x,y){
			return x*y;
		})
	}
	
	function fact2(n){
		return product(d3.range(n,1,-2));
	}
    
	function part_cdf(x,n){
		n=n || 10;
		var tl=d3.range(1,n+1).map(function(i){
			return Math.pow(x,2*i-1)/fact2(2*i-1);
		});
		return 0.5+pdf(x)*d3.sum(tl);
		//return 0.5+pdf(x)*d3.sum([x**(2*i-1)/fact2(2*i-1) for i in range(1,n+1)]);
	}
	
	function star_ppf(p,func){
        if (0<p && p<0.5)
            return -func(p);
        else if (p===0)
            return 0.5;
        else
            return func(1-p);
	}


	function Shannei(a){
		var y=-Math.log(4*a*(1-a));
		var b=5.7262204;
		var c=11.640595;
		var d=2.0611786;
		return Math.sqrt(y*(d-b/(y+c)));
	}
	
	return CRV({pdf:pdf,
						cdf:part_cdf,
						ppf:function(p){
							star_ppf(p,Shannei);
						}});

})();

function Norm(mu,sigma){
	var pdf=function(x){
		return (1/(Math.sqrt(2*Math.PI)*sigma))*Math.exp(-Math.pow(x-mu,2)/(2*Math.pow(sigma,2)));
	}
	var cdf=function(x){
		return norms.cdf((x-mu)/sigma);
	}
	var ppf=function(a){
		return sigma*norms.ppf(a)+mu;
	}
	return CRV({pdf:pdf,
						cdf:cdf,
						ppf:ppf});
}


function normMeanTest(array,mu,sigma){
	var t=(d3.mean(array)-mu)/(sigma/Math.sqrt(array.length)); // anyway I don't know use symbol unless t
	var p=norms.cdf(-Math.abs(t));
	return p;
}

var Beta=(function(){

	function getc(n,x,a,b){
		if (n===0){
			return 1;
		}
		else if (n%2===0){
			k=n/2;
			return (k*(b-k)*x)/((a+2*k-1)*(a+2*k));
		}
		else if (n%2===1){
			k=(n-1)/2
			return -((a+k)*(a+b+k)*x)/((a+2*k)*(a+2*k+1));
		}
	}

	function cfrac(tl){
		if (tl.length===1){
			return tl[0];
		}
		else{
			return tl[0]/(1+cfrac(tl.slice(1)));
		}
	}  

	function I(x,a,b,n,roll){
		n=n || 10;
		roll=roll || true;
		
		if (roll && x>=(a-1)/(a+b-2)):
			return 1-I(1-x,b,a,n,false);
		//left=(gamma(a+b)*(x**a)*((1-x)**b))/(gamma(a+1)*gamma(b));
		var left=(gamma(a+b)*(x**a)*Math.pow((1-x),b))/(gamma(a+1)*gamma(b));
		//right=cfrac([getc(i,x,a,b) for i in range(n+1)])
		var right=cfrac(d3.range(n+1).map(function(i){
			return getc(i,x,a,b);
		}));
		return left*right;
	}

	var two_div=np.two_div;
	var beta=np.beta;

	function beta_ppf(p,a,b){
		return two_div(function(x){return I(x,a,b)-p,0,1});
	}
	
	function _Beta(a,b){
		var pdf=function(x){
			return (1/beta(a,b))*(Math.pow(x,a-1)*Math.pow((1-x),b-1));
		};
		var cdf=function(x){
			return I(x,a,b,10);
		};
		var ppf=function(p){
			return beta_ppf(p,a,b);
		};
		return CRV({pdf:pdf,
							cdf:cdf,
							ppf:ppf})
	}
	
	return _Beta;

})();

