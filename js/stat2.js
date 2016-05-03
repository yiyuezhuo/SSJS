
var stat=(function(){
	
	var gamma,beta,norms_cdf,norms_ppf,norm_cdf,norm_ppf;
	var beta_cdf,beta_ppf,chi2_cdf,chi2_ppf,t_cdf,t_ppf,F_cdf,F_ppf;
	
	var np={sqrt:Math.sqrt,pi:Math.PI,e:Math.E}
	Number.prototype.pow=function(x){
		return Math.pow(this,x);
	}
		
	// export gamma beta
	!function(){
		function Nemes_gamma(x){
			return np.sqrt(2*np.pi/x)*((1/np.e)*(x+1/(12*x-1/(10*x)))).pow(x);
		}
		
		function Nemes_beta(a,b){
			return Nemes_gamma(a)*Nemes_gamma(b)/Nemes_gamma(a+b);
		}
		
		gamma=Nemes_gamma;
		beta=Nemes_beta;
	}();
	
	// export norms_cdf,norms_ppf
	!function(){
		
		function erfs(x){
			// erf(x/sqrt(2))
			b=[0,0.196854,0.115194,0.000344,0.019527]
			return 1-(1+sum([b[i]*x**i for i in range(1,5)]))**(-4)
		}

		function erf_cdf(x){
			return 0.5*(1+erfs(np.abs(x))*np.sign(x))
		}

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
			}();
	
	
	
	
})();