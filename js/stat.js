
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

norms=Norm(0,1);

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
			/*
			cdf.sample.forEach(function(x,i){
				var pBig=cdf(x);
				if(pBig>p){
					var pSmall=cdf(cdf.sample[i-1]);
					var odd=(p-pSmall)/(pBig-pSmall);
					return cdf.sample[i-1]*(1-odd)+x*odd;
				}
			})
			*/
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

function normMeanTest(array,mu,sigma){
	var t=(d3.mean(array)-mu)/(sigma/Math.sqrt(array.length)); // anyway I don't know use symbol unless t
	var p=norms.cdf(-Math.abs(t));
	return p;
}