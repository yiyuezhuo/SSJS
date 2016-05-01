
!(function(){
	
	function boardcastConstant(func,array,constant,shape){
		if(shape.length===1){
			return d3.range(shape[0]).map(function(d){
				return func(array[d],constant);
			})
		}
		else{
			return d3.range(shape[0]).map(function(d){
				return boardcastConstant(func,array[d],constant,shape.slice(1));
			})
		}
	}
	
	function boardcastSameShape(func,array1,array2,shape){
		var i;
		if(shape.length===1){
			return d3.range(shape[0]).map(function(d){
				return func(array1[d],array2[d]);
			});
		}
		else{
			return d3.range(shape[0]).map(function(d){
				return boardcastSameShape(func,array1[d],array2[d],shape.slice(1));
			})
		}
	}
	
	function boardcastReduce(func,array1,array2,reduceShape,sameShape){
		if(reduceShape.length===0){
			return boardcastSameShape(func,array1,array2,sameShape);
		}
		else{
			return d3.range(reduceShape[0]).map(function(d){
				return boardcastReduce(func,array1[d],array2,reduceShape.slice(1),sameShape);
			})
		}
	}
	
	function boardcast(func,array1,array2){
		var i;
		var shape1=array1.shape();
		if (array2.shape){
			var shape2=array2.shape();
		}
		else{
			return boardcastConstant(func,array1,array2,shape1);
		}
		var stack=[];
		for(i=0;i<shape2.length;i++){
			if(shape1[shape1.length-1-i]===shape2[shape2.length-1-i]){
				stack.push(shape1[shape1.length-1-i]);
			}
			else{
				break;
			}
		}
		stack.reverse();
		reduceShape=shape1.slice(0,shape1.length-i);
		return boardcastReduce(func,array1,array2,reduceShape,stack);
	}
	
	function gradientDescentStep(X,Y,P,func,grad){
		// X=[[1,2],[3,4],[5,6]] Y=[1,2] P=[0,0,0] (init) func=(X,P)|->y grad=(P1,P2,P3)|->(1,1,-1)
		// sum_i 2*(X[i]-f(X[i],P))*(-\grad(f(X[i],P)))
		var rl=d3.range(X.length).map(function(i){
			return grad(X[i],P).mult(2*(Y[i]-func(X[i],P)))
		});
		return rl.reduce(function(x,y){
			return x.add(y);
		});
	}
	
	function gradientDescent(X,Y,P,func,grad,alpha,n){
		d3.range(n).forEach(function(i){
			P=P.add(gradientDescentStep(X,Y,P,func,grad,alpha).mult(alpha));
		})
		return P;
	}
	
	function solve(X,Y,P){
		P=P||d3.range(X[0].length).map(function(x){
			return 0;
		})
		n=10000;
		alpha=0.01;
		var func=function(X,P){
			return X.dot(P);
		};
		var grad=function(X,P){
			return X;
		}
		return gradientDescent(X,Y,P,func,grad,alpha,n);
	}
	
	function inverse(X){
		return d3.range(X.length).map(function(i){
			var Y=d3.range(X.length).map(function(j){return 0;});
			Y[i]=1;
			return solve(X,Y);
		}).T();
	}
	
	Array.prototype.shape=function(){
		if(this[0].length){
			return [this.length].concat(this[0].shape());
		}
		else{
			return [this.length];
		}
	}
	
	Array.prototype.add=function(right){
		return boardcast(function(x,y){
			return x+y;
		},this,right);
	}
	
	Array.prototype.sub=function(right){
		return boardcast(function(x,y){
			return x-y;
		},this,right);	
	}

	Array.prototype.mult=function(right){
		return boardcast(function(x,y){
			return x*y;
		},this,right);	
	}
	
	Array.prototype.div=function(right){
		return boardcast(function(x,y){
			return x/y;
		},this,right);	
	}
	
	Array.prototype.pow=function(right){
		return boardcast(function(x,y){
			return Math.pow(x,y);
		},this,right);	
	}
	
	Array.prototype.dot=function(right){
		var i,j;
		var left=this;
		var shape1=left.shape();
		var shape2=right.shape();
		if(shape1.length===1 && shape2.length===1){
			return d3.sum(d3.range(shape1[0]).map(function(i){
				return left[i]*right[i];
			}))
		}
		else if(shape2.length===1){
			return left.map(function(row){
				return row.dot(right);
			});
		}
		else{
			var mat=[];
			for(i=0;i<shape1[0];i++){
				var row=[];
				for(j=0;j<shape2[1];j++){
					var a=d3.sum(d3.range(shape1[1]).map(function(k){
						return left[i][k]*right[k][j];
					}));
					row.push(a);
				}
				mat.push(row);
			}
			return mat;
		}
	}
	
	Array.prototype.mean=function(){
		return d3.mean(this);
	}
	
	Array.prototype.std=function(){
		return d3.deviation(this);
	}
	
	Array.prototype.T=function(){
		return d3.transpose(this);
	}
	
	Array.prototype.inv=function(){
		return inverse(this);
	}
	
	function gamma(x,a,b){
		//return np.sqrt(2*np.pi/x)*((1/np.e)*(x+1/(12*x-1/(10*x))))**x
		return np.sqrt(2*Math.PI/x)*((1/Math.E)*Math.pow((x+1/(12*x-1/(10*x)))),x);
	}
	
	function beta(a,b){
		return gamma(a)*gamma(b)/gamma(a+b);
	}
	
	function two_div(f,a,b,epsilon=1e-4):
		while (true){
			var test=(a+b)/2
			if (b-a<epsilon)
				return test;
			if (f(test)===0)
				return test;
			else if (f(test)>0)
				a,b=a,test;
			else
				a,b=test,b;
		}
		
	function linspace(start,end,size){
		var step=(end-start)/(size-1);
		return d3.range(start,end+step,step);
	}
	
	
	window.linalg={solve:solve};
	window.np={solve:solve,
						sqrt:Math.sqrt,
						pi:Math.PI,
						e:Math.E,
						gamma:gamma,
						beta:beta,
						two_div:two_div,
						gradientDescent:gradientDescent,
						linspace:linspace}
	//anyway gamma is located in scipy.special for origin
	
})();