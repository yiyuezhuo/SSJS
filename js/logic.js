
var DataFrame=pd.DataFrame;

var inputFile=document.getElementById('inputFile');
var inputLoad=document.getElementById('inputLoad');

var divTable=document.getElementById('divTable');
var divTableOutput=document.getElementById('divTableOutput');

var inputMean=document.getElementById('inputMean');
var inputStd=document.getElementById('inputStd');




var buttonTest=document.getElementById('buttonTest');
var buttonDesc=document.getElementById('buttonDesc');

var pOutput=document.getElementById('pOutput');




var tabs=$('#tabs');

var selectVariable=d3.select('#selectVariable');

var wrapTable;

function locOption(selection){
	selection.attr('value',function(d){
		return d;
	})
	.text(function(d){
		return d;
	})
}

function updateOption(){
	var selection=selectVariable.selectAll('option').data(wrapTable.columns);
	selection.enter().append('option').call(locOption);
	selection.call(locOption);
	selection.exit().remove();
}

function renderTable(dom,df){
	dom.textContent='';
	return new Handsontable(dom,{
				data:df.data,
				colHeaders:df.columns,
				rowHeaders:df.index,
				contextMenu:true
			});
}

!function(){
	inputLoad.onclick=function(){
		var file=inputFile.files[0];
		var reader=new FileReader();
		reader.readAsText(file);
		reader.onload=function(event){
			var content=event.target.result;
			// use content do something..
			//wrapTable=parseCSV(content);
			//wrapTable=new DataFrame(content);
			wrapTable=DataFrame.createByCSV(content);
			renderTable(divTable,wrapTable);
			
			updateOption();
			buttonTest.onclick=function(){
				var variableKey=selectVariable[0][0].value;
				var array=wrapTable.get(variableKey);
				var mean=Number(inputMean.value);
				var std=Number(inputStd.value);
				
				var p=normMeanTest(array,mean,std);
				d3.select(pOutput).text('p值为'+p);
			}
			buttonDesc.onclick=function(){
				var df=wrapTable.describe();
				renderTable(divTableOutput,df);
			}
			
		}
		
	}
	
	tabs.tabs();
	
}();