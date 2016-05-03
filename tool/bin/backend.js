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