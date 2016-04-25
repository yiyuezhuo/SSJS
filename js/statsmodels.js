
function parseFormula(formula){
	var endog_exog_=formula.split('~');
	var endog=endog_exog_[0];
	var exog_=endog_exog_[1];
	var exog=exog_.split('+').map(function(s){
		return s.trim();
	});
	return {exog:exog,endog:endog}
}

function OLS(endog,exog,endogName,exogName){
	this.exogValue=exog;
	this.endogValue=endog;
	this.exogName=exogName || d3.range(1,exog[0].length+1).map(function(i){
		return 'x'+i;
	});
	this.endogName=endogName || 'y';
}
OLS.prototype.fit=function(){
	var params=linalg.solve(this.exogValue,this.endogValue);
	return new FitResult(this,params);
}
OLS.createByFormula=function(formula,df){
	var form=parseFormula(formula);
	var _exogValue=form.exog.map(function(name){
		return df.get(name);
	});
	_exogValue.push(d3.range(_exogValue[0].length).map(function(i){return 1;}));
	var exogValue=_exogValue.T();
	var endogName=form.endog;
	var exogName=form.exog.concat(['const']);
	var endogValue=df.get(form.endog);
	return new OLS(endogValue,exogValue,endogName,exogName);
}

function ols(formula,df){
	return OLS.createByFormula(formula,df);
}

function FitResult(model,params){
	this.model=model;
	this.params=params;
}
FitResult.prototype.summary=function(){
	var s='';
	[this.model.exogName,this.params].T().forEach(function(t){
		var name=t[0];
		var value=t[1];
		s+=name+' : '+value+'  ';
	});
	return s;
}
FitResult.prototype.predict=function(exog){
	var that=this;
	if(!exog){
		return this.model.exogValue.map(function(X){
			return that.predict(X);
		})
	}
	exog=JSON.parse(JSON.stringify(exog));
	exog['const']=1;
	var X=this.model.exogName.map(function(name){
		exog[name];
	});
	if(exog.length){
		d3.range(exog.length).forEach(function(i){
			X[i]=exog[i];
		})
	}
	return this.params.dot(X);
}
FitResult.prototype.resid=function(){
	return this.model.exogValue.map(function(X,i){
		var y=this.model.endogValue[i];
		return y-X.dot(this.params);
	})
}

function SS(Y1,Y2){
	return d3.sum(Y1.sub(Y2).pow(2));
}

FitResult.prototype.TSS=function(){
	var Y=this.model.endogValue;
	var Ybar=d3.mean(Y);
	return SS(Y,Ybar);
}
FitResult.prototype.ESS=function(){
	var Yhat=this.predict();
	var Ybar=d3.mean(Y);
	return SS(Yhat,Ybar);
}
FitResult.prototype.RSS=function(){
	var Y=this.model.endogValue;
	var Yhat=this.predict();
	return SS(Y,Yhat);
}
FitResult.prototype.R2=function(){
	var Y=this.model.endogValue;
	var Ybar=d3.mean(Y);
	var Yhat=this.predict();
	var tss=SS(Y,Ybar);
	var ess=SS(Yhat,Ybar);
	var rss=SS(Y,Yhat);
	return ess/tss;
}